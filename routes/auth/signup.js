require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
      .json({ error: "Invalid input is recieved in one or more field(s)" });
  }
  let ToDate = new Date();
  if (new Date(dob).getTime() > ToDate.getTime()) {
    return res
      .status(400)
      .json({ error: "Please enter a valid date of birth" });
  }
  if (gender !== "male" && gender !== "female" && gender !== "not said") {
    return res.status(400).json({ error: "Please select valid field!" });
  }
  if (phone !== "" && phone !== undefined && !phoneregex.test(phone)) {
    return res.status(400).json({ error: "Please enter a valid phone number" });
  }
  if (confirmPassword !== password) {
    return res.status(400).json({ error: "Passwords do not match!" });
  }
  //checking for already existing user;
  const duplicate = await UserSchema.findOne({ email: email }).exec();

  if (duplicate)
    return res
      .status(409)
      .json({ error: { message: "This email is already registered!" } });

  try {
    //encrypt password
    const salt = await bcryptjs.genSalt(10);
    const hashedPwd = await bcryptjs.hash(password, salt);

    const result = await UserSchema.create({
      dob,
      email,
      firstName,
      gender,
      lastName,
      password: hashedPwd,
      phone,
    });
    const payload = {
      user: {
        id: result._id,
      },
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    res.status(201).json({
      message: `Hooray! ${firstName} you have successfully been registered.`,
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
