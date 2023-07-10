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
    if (!req.body.credential) {
      return res
        .status(400)
        .json({ error: "Email and password are required to sign-in" }); //bad request
    }
    const verificationResponse = await verifyGoogleToken(req.body.credential);
    if (verificationResponse.error) {
      return res.status(400).json({
        message: verificationResponse.error,
      });
    }
    const profile = verificationResponse?.payload;
    const email = profile.email;
    const foundUser = await UserSchema.findOne({ email }).exec();

    if (foundUser) {
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
      //*handle signin
      if (!cookies?.jwt) {
        //new sign in
        const user = await UserSchema.findOneAndUpdate(
          { email },
          {
            $push: {
              refreshToken: newRefreshToken,
            },
          }
        ).exec();
      }
      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await UserSchema.findOne({ refreshToken }).exec();
        if (!foundToken) {
          // detected RT reuse
          const hackedUser = await UserSchema.findOneAndUpdate(
            { email },
            {
              $set: {
                refreshToken: [newRefreshToken],
              },
            }
          ).exec();
        } else {
          //everything is okay
          const user = await UserSchema.findOneAndUpdate(
            { email: email, refreshToken: refreshToken },
            {
              $set: {
                "refreshToken.$": newRefreshToken,
              },
            }
          ).exec();
        }
        res.clearCookie("jwt", {
          httpOnly: true,
        });
      }
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true, // put this option in production but not in dev server
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    } else {
      //*handle signUp
      //generate and encrypt password
      const password = crypto.randomBytes(8).toString("hex");
      const salt = await bcryptjs.genSalt(10);
      const hashedPwd = await bcryptjs.hash(password, salt);

      const result = await UserSchema.create({
        email: profile.email,
        firstName: profile.given_name,
        gender: "not said",
        lastName: profile.family_name,
        password: hashedPwd,
      });
      const payload = {
        user: {
          id: result._id,
        },
      };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
      res.status(201).json({
        message: `Hooray! ${profile.given_name} you have successfully been registered.`,
        accessToken,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "An error occurred. Registration failed.",
    });
  }
});

module.exports = router;
