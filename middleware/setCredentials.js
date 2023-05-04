const allowedOrigins = require("../config/allowedOrigins");

const setCredentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  }
};
module.exports = setCredentials;
