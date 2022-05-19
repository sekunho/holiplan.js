let jwt = require('jsonwebtoken');

const db = require('../db');
const { parse_error } = require('./query_util');

user = {
  login: async (pool, username, password) => {
    try {
      const res = await db.query(
        pool,
        'SELECT * FROM api.login($1::CITEXT, $2::TEXT)',
        [username, password]
      );

      if (res.rows[0].login == null) {
        return {code: 404, error: 'User does not exist'};
      } else {
        let token = jwt.sign(res.rows[0].login, process.env.HPSECRET);

        return {code: 200, payload: token};
      }
    } catch (e) {
      parse_error(e);
    }
  },
  register: async (pool, username, password) => {
    try {
      const res = await db.query(
        pool,
        'SELECT * FROM api.register($1::CITEXT, $2::TEXT)',
        [username, password]
      );

      if (res.rows[0].register == null) {
        return {code: 404, error: 'User does not exist'};
      } else {
        let token = jwt.sign(res.rows[0].register, process.env.HPSECRET);

        return {code: 200, payload: token};
      }
    } catch (e) {
      parse_error(e);
    }
  }

};

module.exports = user;
