const db = require('../db');
const { parse_error } = require('./query_util');
const holidapi = require('../holidapi');

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

      let plan = res.rows[0].get_plan_details;

      const holiday = await holidapi.list_holidays(
        plan.country,
        {start: plan.date, end: plan.date}
      );

      plan = {...plan, holiday: holiday.data.data[0]};

      return {code: 200, payload: plan};
    } catch (e) {
      return parse_error(e);
    }
  },
  create_plan: async (pool, user_id, plan) => {
    try {
      const is_valid_holiday = await holidapi.is_valid_holiday(
        plan.country,
        plan.date,
        plan.holiday_id
      );

      if (is_valid_holiday == true) {
        console.log('valid!');
        const res = await db.authenticate_query(
          pool,
          user_id,
          'SELECT * FROM api.create_plan($1, $2, $3, $4, $5)',
          [
            plan.name,
            plan.description,
            plan.date,
            plan.holiday_id,
            plan.country
          ]
        );

        return {code: 201, payload: res.rows[0].create_plan};
      } else {
        return {
          code: 400,
          payload: {
            error_code: 'E007',
            message: 'E007: The holiday does not fall on this date'
          }
        }
      }
    } catch (e) {
      return parse_error(e);
    }
  },
  edit_plan: async (pool, user_id, plan) => {
    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.edit_plan($1, $2, $3)',
        [plan.plan_id, plan.name, plan.description]
      );

      return {code: 200, payload: res.rows[0].edit_plan};
    } catch (e) {
      return parse_error(e);
    }
  },
  delete_plan: async (pool, user_id, plan_id) => {
    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.delete_plan($1)',
        [plan_id]
      );

      return {code: 200, payload: res.rows[0].delete_plan};
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
  },
  create_event: async (pool, user_id, event) => {
    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.create_event($1, $2, $3, $4)',
        [event.plan_id, event.name, event.start_date, event.end_date]
      );

      console.log('Why is it here', res);

      return {code: 200, payload: res.rows[0].create_event};
    } catch (e) {
      return parse_error(e);
    }
  },
  edit_event: async (pool, user_id, event) => {
    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.edit_event($1, $2, $3, $4)',
        [event.event_id, event.name, event.start_date, event.end_date]
      );

      return {code: 200, payload: res.rows[0].edit_event};
    } catch (e) {
      return parse_error(e);
    }
  },
  delete_event: async (pool, user_id, event_id) => {
    try {
      const res = await db.authenticate_query(
        pool,
        user_id,
        'SELECT * FROM api.delete_event($1)',
        [event_id]
      );

      return {code: 200, payload: res.rows[0].delete_event};
    } catch (e) {
      return parse_error(e);
    }
  },
};

module.exports = plan;
