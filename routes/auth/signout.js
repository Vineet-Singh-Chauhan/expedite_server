require("dotenv").config();
const express = require("express");
const router = express.Router();
const UserSchema = require("../../models/UserSchema");

router.post("/", async (req, res) => {
  // on client , also delete the accesstoken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  const foundUser = await UserSchema.findOne({ refreshToken }).exec();

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  // delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt != refreshToken
  );

  const result = await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  console.log(result);
  // these options need to be identical to when the cookie was created (ie same as in authController)

  res.sendStatus(204);
});

module.exports = router;
