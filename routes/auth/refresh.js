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

  // to make refresh token single use
  res.clearCookie("jwt", {
    httpOnly: true,
  });

  const foundUser = await UserSchema.findOne({
    refreshToken: refreshToken,
  }).exec();
  if (!foundUser) {
    // detected refresh token reuse
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          // tempered refresh token
          return res.sendStatus(403);
        }

        // used refresh token
        const hackedUser = await UserSchema.findByIdAndUpdate(decoded.user.id, {
          $set: {
            refreshToken: [],
          },
        }).exec();
      }
    );
    return res.sendStatus(403);
  }

  // if everything is okay
  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        const foundUser2 = await UserSchema.findOneAndUpdate(
          { refreshToken: refreshToken },
          {
            $pull: {
              refreshToken: refreshToken,
            },
          }
        ).exec();
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
      const foundUser3 = await UserSchema.findOneAndUpdate(
        { _id: decoded.user.id, refreshToken: refreshToken },
        {
          $set: {
            "refreshToken.$": newRefreshToken,
          },
        }
      ).exec();

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
