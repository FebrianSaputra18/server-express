const { getToken, policyFor } = require("../utils");
const jwt = require("jsonwebtoken");
const config = require("../app/config");
const User = require("../app/user/model");

function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);

      if (!token) return next();

      req.user = jwt.verify(token, config.secretkey);

      let user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        res.json({
          error: 1,
          message: "Token Expired",
        });
      }
    } catch (err) {
      if (err && err.name === "Json Web Token Error") {
        return res.json({
          error: 1,
          message: err.message,
        });
      }
      next();
    }
    return next()
  };
}

//middleware untuk cek hak access
function police_check(action, subject) {
  return function(req, res, next) {
    let policy = policyFor(req.user)
    if (!policy.can(action, subject)) {
      return res.json({
        error: 1,
        message: `Access denied ${action}${subject}`
      })
    }
    next()
  }
}

module.exports = {
    decodeToken,
    police_check,
}
