const jwt = require('jsonwebtoken');

module.exports = function get_current_user(req, _res, next) {
  const token = req.cookies.token;

  if (token) {
    const user_json = jwt.verify(token, process.env.HPSECRET);

    req.current_user_id = user_json.user_id;
    next();
  } else {
    req.current_user_id = null;
    next();
  }
};
