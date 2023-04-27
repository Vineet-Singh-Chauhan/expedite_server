const express = require("express");
const router = express.Router();

//* schema
const UserSchema = require("../models/userSchema");

//create a user using POST "api/auth". doesnot require auth
router.post("/", async (req, res) => {
  console.log(req.body);
  const user = UserSchema(req.body);
  await user.save();
  res.send({ msg: "user created" });
});
module.exports = router;
