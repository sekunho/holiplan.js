const db = require('../db');
const jwt = require('jsonwebtoken');
const { parse_error } = require('./query_util');

plan = {
  list_plans: async (pool, token) => {
    let user_id = null;

    if (token) {
      user_id = jwt.verify(token, process.env.HPSECRET).user_id;
    }

    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.list_plans()',
        []
      );

      return {code: 200, payload: res.rows[0].list_plans};
    } catch (e) {
      return parse_error(e);
    }
  }
};

module.exports = plan;
