require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = require("../../models/UserSchema");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required to sign-in" }); //bad request
  }
  try {
    const foundUser = await UserSchema.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(400).json({ error: "Enter valid email and password" }); //bad request
    }
    const passwordCompare = await bcryptjs.compare(
      password,
      foundUser.password
    );
    if (!passwordCompare) {
      return res.status(400).json({ error: "Enter valid email and password" }); //bad request
    }
    const payload = {
      user: {
        id: foundUser._id,
      },
    };
    console.log(payload);
    const authToken = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ authToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Route 3: get logged in user's details using POST, login required
router.post("/getUser", async (req, res) => {
  try {
    userId = "todo";
    // grab all details except pssword
    const user = await UserSchema.findById(userId).select("-password");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
