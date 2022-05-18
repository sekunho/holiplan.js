const db = require('../db');
const { parse_error } = require('./query_util');

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
      return parse_error(e);
    }
  },
  get_plan_details: async (pool, user_id, plan_id) => {
    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.get_plan_details($1::UUID)',
        [plan_id]
      );

      if (res.rows[0].get_plan_details) {
        return {code: 200, payload: res.rows[0].get_plan_details};
      } else {
        return {
          code: 404,
          payload: {
            error_code: 'E004',
            message: 'E004: Resource not found'
          }
        }
      }
    } catch (e) {
      return parse_error(e);
    }
  },
  create_comment: async (pool, user_id, comment) => {
    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.create_comment($1, $2)',
        [comment.plan_id, comment.content]
      );

      return {code: 201, payload: res.rows[0].create_comment};
    } catch (e) {
      return parse_error(e);
    }
  },
  edit_comment: async (pool, user_id, comment) => {
    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.edit_comment($1, $2)',
        [comment.comment_id, comment.content]
      );

      return {code: 200, payload: res.rows[0].edit_comment};
    } catch (e) {
      return parse_error(e);
    }
  },
  delete_comment: async (pool, user_id, comment_id) => {
    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.delete_comment($1)',
        [comment_id]
      );

      return {code: 200, payload: res.rows[0].delete_comment};
    } catch (e) {
      return parse_error(e);
    }
  }
};

module.exports = plan;
