const express = require("express");
const UserSchema = require("../models/UserSchema");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    // grab all details except password and refresh tokens
    const user = await UserSchema.findById(
      userId,
      "-password -refreshToken"
    ).populate("workspaces", "name");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
