require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserSchema = require("../../models/UserSchema");

router.get("/", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;
  console.log("refresh token revieved", refreshToken);

  // to make refresh token single use
  res.clearCookie("jwt", {
    httpOnly: true,
  });

  const foundUser = await UserSchema.findOne({ refreshToken }).exec();
  console.log(foundUser);
  if (!foundUser) {
    // detected refresh token reuse
    console.log("not this");
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        // tempered refresh token
        if (err) return res.sendStatus(403);

        // used refresh token
        console.log("decode id", decoded.user.id);
        const hackedUser = await UserSchema.findOne({
          _id: decoded.user.id,
        }).exec();
        // console.log("from refresh", hackedUser);
        if (hackedUser) {
          hackedUser.refreshToken = []; // invalidated all refresh tokens
        }
        const result = await hackedUser.save();
        console.log("form refresh", result);
      }
    );
    return res.sendStatus(403);
  }

  // if everything is okay
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
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
        console.log("from refresh:", err);
        return res.sendStatus(403);
      }
      // refresh token is still valid
      const payload = {
        user: {
          id: foundUser._id,
        },
      };
      console.log("from refresh 2", payload);
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
      console.log("new token:", newRefreshToken);
      const result = await foundUser.save();
      console.log("new user:", foundUser);
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true, // put this option in production but not in dev server
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    }
  );
});
module.exports = router;
