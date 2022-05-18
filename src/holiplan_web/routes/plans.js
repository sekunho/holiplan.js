var express = require('express');
var router = express.Router();
let plan = require('../../holiplan/plan');

// Index plans
router.get('/', async function(req, res, next) {
  const pool = req.app.get('db');
  const json = await plan.list_plans(pool, req.current_user_id);

  res
    .status(json.code)
    .json(json.payload);
});

// Get plan details
router.get('/:plan_id', async function(req, res, next) {
  const pool = req.app.get('db');

  const json = await plan.get_plan_details(
    pool,
    req.current_user_id,
    req.params.plan_id
  );

  res
    .status(json.code)
    .json(json.payload);
});

// Create a new plan
router.post('/', async function(req, res, next) {
  const pool = req.app.get('db');

  const json = await plan.create_plan(
    pool,
    req.current_user_id,
    req.body
  );

  res
    .status(json.code)
    .json(json.payload);
});

// Edit plan
router.patch('/:plan_id', async function(req, res, next) {
  const pool = req.app.get('db');

  const json = await plan.edit_plan(
    pool,
    req.current_user_id,
    {
      plan_id: req.params.plan_id,
      name: req.body.name,
      description: req.body.description
    }
  );

  res
    .status(json.code)
    .json(json.payload);
});

// Delete plan
router.delete('/:plan_id', async function(req, res, next) {
  const pool = req.app.get('db');

  const json = await plan.delete_plan(
    pool,
    req.current_user_id,
    req.params.plan_id
  );

  res
    .status(json.code)
    .json(json.payload);
});

// EVENTS

// Create plan event
router.post('/:plan_id/events', async function(req, res, next) {
  const pool = req.app.get('db');

  const json = await plan.create_event(
    pool,
    req.current_user_id,
    {
      plan_id: req.params.plan_id,
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date
    }
  );

  res
    .status(json.code)
    .json(json.payload);
});

// Edit a plan event
router.patch('/events/:event_id', async function(req, res, next) {
  const pool = req.app.get('db');

  const json = await plan.edit_event(
    pool,
    req.current_user_id,
    {
      event_id: req.params.event_id,
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date
    }
  );

  res
    .status(json.code)
    .json(json.payload);
});

// Delete plan event
router.delete('/events/:event_id', async function(req, res, next) {
  const pool = req.app.get('db');

  const json = await plan.delete_event(
    pool,
    req.current_user_id,
    req.params.event_id
  );

  res
    .status(json.code)
    .json(json.payload);
});

// COMMENTS

// Create a new plan comment
router.post('/:plan_id/comments', async function(req, res, next) {
  const pool = req.app.get('db');

  const json = await plan.create_comment(
    pool,
    req.current_user_id,
    {plan_id: req.params.plan_id, content: req.body.content}
  );

  res
    .status(json.code)
    .json(json.payload);
});

// Edit comment
router.patch('/comments/:comment_id', async function(req, res, next) {
  const pool = req.app.get('db');

  const json = await plan.edit_comment(
    pool,
    req.current_user_id,
    {
      comment_id: req.params.comment_id,
      content: req.body.content
    }
  )

  res
    .status(json.code)
    .json(json.payload);
});

// Delete comment
router.delete('/comments/:comment_id', async function(req, res, next) {
  const pool = req.app.get('db');

  const json = await plan.delete_comment(
    pool,
    req.current_user_id,
    req.params.comment_id
  );

  res
    .status(json.code)
    .json(json.payload);
});

module.exports = router;
