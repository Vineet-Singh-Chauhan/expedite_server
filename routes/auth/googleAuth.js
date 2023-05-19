const express = require("express");
const verifyGoogleToken = require("../../middleware/verifyGoogleToken");
const jwt = require("jsonwebtoken");
const UserSchema = require("../../models/UserSchema");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const cookies = req.cookies;
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }
      const profile = verificationResponse?.payload;
      const foundUser = await UserSchema.findOne({
        email: profile.email,
      }).exec();

      // console.log("from profile", profile);

      if (foundUser) {
        const payload = {
          user: {
            id: foundUser._id,
          },
        };
        // console.log("from signin:", payload);
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

        // invalidating used token
        let newRefreshTokenArray = !cookies?.jwt
          ? foundUser.refreshToken
          : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

        if (cookies?.jwt) {
          const refreshToken = cookies.jwt;
          const foundToken = await UserSchema.findOne({ refreshToken }).exec();

          // detected RT reuse
          if (!foundToken) {
            // console.log("attempted refresh token reuse at login");
            newRefreshTokenArray = [];
          }

          res.clearCookie("jwt", {
            httpOnly: true,
          });
        }

        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        // console.log(result);

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true, // put this option in production but not in dev server
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken });
      } else {
        //generate and encrypt password
        const password = crypto.randomBytes(8).toString("hex");
        const salt = await bcryptjs.genSalt(10);
        const hashedPwd = await bcryptjs.hash(password, salt);

        const result = await UserSchema.create({
          dob: Date.now(),
          email: profile.email,
          firstName: profile.given_name,
          gender: "not said",
          lastName: profile.family_name,
          password: hashedPwd,
        });
        // console.log(result);
        const payload = {
          user: {
            id: result._id,
          },
        };
        // console.log(payload);
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
        // console.log(accessToken);
        res.status(201).json({
          message: `Hooray! ${profile.given_name} you have successfully been registered.`,
          accessToken,
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "An error occurred. Registration failed.",
    });
  }
});

module.exports = router;
