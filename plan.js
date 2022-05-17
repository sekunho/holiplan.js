const db = require('./db');

plan = {
  list_plans: async (pool, user_id) => {
    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.list_plans()',
        []
      );

      return {code: 200, payload: res.rows[0].list_plans};
    } catch (e) {
      parse_error(e);
    }
  }
};

/// Parses postgres errors into consumable JSON (with the status code).
function parse_error(e) {
  switch(e.code) {
    case '42501':
      return {
        code: 401,
        payload: {
          error_code: 'E001',
          message: 'E001: You are not authorized to access this resource.'
        }
      };
    default:
      return {
        code: 500,
        payload: {
          error_code: 'E002',
          message: 'E002: Something terribly wrong has happened.'
        }
      };
  }
}

module.exports = plan;
