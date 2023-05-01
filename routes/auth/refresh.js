require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserSchema = require("../../models/UserSchema");

router.post("/", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  // to make refresh token single use
  res.clearCookie("jwt", { httpOnly: true });

  const foundUser = await UserSchema.findOne({ refreshToken }).exec();

  if (!foundUser) {
    // detected refresh token reuse
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        // tempered refresh token
        if (err) return res.sendStatus(403);

        // used refresh token
        const hackedUser = await UserSchema.findOne({
          id: decoded.user.id,
        }).exec();
        hackedUser.refreshToken = []; // invalidated all refresh tokens
        const result = await hackedUser.save();
        console.log(result);
      }
    );
  }

  // if everything is okay
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt != refreshToken
  );

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if (err || foundUser.id !== decoded.user.id) {
        console.log(err);
        return res.sendStatus(403);
      }
      // refresh token is still valid
      const payload = {
        user: {
          id: foundUser._id,
        },
      };
      console.log(payload);
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30s",
      });

      const newRefreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      // saving refresh token with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        // secure: true, // put this option in production but not in dev server
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    }
  );
});
module.exports = router;
