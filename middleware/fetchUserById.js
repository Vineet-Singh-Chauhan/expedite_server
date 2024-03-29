require("dotenv").config();
const jwt = require("jsonwebtoken");

const fetchUserById = (req, res, next) => {
  //get the user from the jwt token and add id to req object
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(403)
      .send({ error: " no token Please authenticate using a valid token !" });
  }
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.log("from fetch user byId,", error.message);
    res
      .status(403)
      .send({ error: "Please authenticate using a valid token !" });
  }
};

module.exports = fetchUserById;
