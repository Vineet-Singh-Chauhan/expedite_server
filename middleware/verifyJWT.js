const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader;
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); // invalid token
      req.user = decoded.user;
      next();
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(403)
      .send({ error: "Please authenticate using a valid token !" });
  }
};

module.exports = verifyJWT;
