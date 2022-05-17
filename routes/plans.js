var express = require('express');
var router = express.Router();
let plan = require('../plan');

// Index plans
router.get('/', async function(req, res, next) {
  const pool = req.app.get('db');
  const json = await plan.list_plans(pool, '1');

  res.status(json.code);
  res.send(JSON.stringify(json.payload));
});

// Get plan details
router.get('/:plan_id', function(req, res, next) {
  console.log(req.params.plan_id);
  res.send('respond with a resource');
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
})

module.exports = router;
