const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
//* schema
const UserSchema = require("../../models/UserSchema");
const {
  nameregex,
  emailregex,
  phoneregex,
  passwordRegex,
} = require("../../config/regex");

//create a user using POST "api/auth". doesnot require auth
router.post("/", async (req, res) => {
  const {
    confirmPassword,
    dob,
    email,
    firstName,
    gender,
    lastName,
    password,
    phone,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !gender ||
    !dob ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  if (
    !nameregex.test(firstName) ||
    !nameregex.test(lastName) ||
    !emailregex.test(email) ||
    !passwordRegex.test(password)
  ) {
    return res
      .status(400)
      .json({ error: "Please fill valid values in all fields" });
  }
  let ToDate = new Date();
  if (new Date(dob).getTime() > ToDate.getTime()) {
    return res
      .status(400)
      .json({ error: "Please enter a valid date of birth" });
  }
  if (phone !== "" && !phoneregex.test(phone)) {
    return res.status(400).json({ error: "Please enter a phone number" });
  }
  if (confirmPassword !== password) {
    return res.status(400).json({ error: "Passwords do not match!" });
  }
  //checking for already existing user;
  const duplicate = await UserSchema.findOne({ email: email }).exec();

  if (duplicate) return res.sendStatus(409);

  try {
    //encrypt password
    const hashedPwd = await bcryptjs.hash(password, 10);
    if (phone) {
      const result = await UserSchema.create({
        dob,
        email,
        firstName,
        gender,
        lastName,
        password: hashedPwd,
        phone,
      });
      console.log(result);

      res.status(201).json({ message: `New User ${firstName} Created` });
    } else if (!phone) {
      const result = await UserSchema.create({
        dob,
        email,
        firstName,
        gender,
        lastName,
        password: hashedPwd,
      });
      console.log(result);

      res.status(201).json({ message: `New User ${firstName} Created` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
