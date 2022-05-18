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

// Edit plan
router.patch('/:plan_id', function(req, res, next) {
  console.log(req.params.plan_id);
  res.send('respond with a resource');
});

// Delete plan
router.delete('/:plan_id', function(req, res, next) {
  console.log(req.params.plan_id);
  res.send('respond with a resource');
});

// EVENTS

// Create plan event
router.post('/:plan_id/events', function(req, res, next) {
  res.send('respond with a resource');
});

// Edit a plan event
router.patch('/:plan_id/events/:event_id', function(req, res, next) {
  res.send('respond with a resource');
});

// Delete plan event
router.delete('/:plan_id/events/:event_id', function(req, res, next) {
  res.send('respond with a resource');
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
