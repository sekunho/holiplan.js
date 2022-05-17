let express = require('express');
let router = express.Router();
let user = require('../../holiplan/user');


router.post('/login', async function(req, res, next) {
  const pool = req.app.get('db');
  const json = await user.login(pool, req.body.username, req.body.password);

  if (json.code == 200) {
    res
      .cookie('token', json.payload, { httpOnly: true })
      .sendStatus(json.code);
  } else {
    res.sendStatus(json.code);
  }
});

router.post('/register', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  res.send('respond with a resource');
});

router.get('/logout', function(req, res, next) {
  res
    .clearCookie('token')
    .send({message: 'Successfully logged out'});
});

module.exports = router;
