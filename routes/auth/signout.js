require("dotenv").config();
const express = require("express");
const router = express.Router();
const UserSchema = require("../../models/UserSchema");

router.post("/", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  const foundUser = await UserSchema.findOneAndUpdate(
    { refreshToken },
    {
      $pull: {
        refreshToken: refreshToken,
      },
    }
  ).exec();

  res.clearCookie("jwt", {
    httpOnly: true,
  });

  res.sendStatus(204);
});

module.exports = router;
