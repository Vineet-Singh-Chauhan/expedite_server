require("dotenv").config();
const jwt = require("jsonwebtoken");

const fetchUserById = (req, res, next) => {
  //get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  //   console.log(token);
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token !" });
  }
  try {
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = data.user;
    // console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send({ error: "Please authenticate using a valid token !" });
  }
};

module.exports = fetchUserById;
