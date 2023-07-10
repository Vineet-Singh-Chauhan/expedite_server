require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = require("../../models/UserSchema");

router.post("/", async (req, res) => {
  const cookies = req.cookies;
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required to sign-in" }); //bad request
  }
  try {
    const foundUser = await UserSchema.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(400).json({ error: "Enter valid email and password!" }); //bad request
    }
    const passwordCompare = await bcryptjs.compare(
      password,
      foundUser.password
    );
    if (!passwordCompare) {
      return res.status(400).json({ error: "Enter valid email and password!" }); //bad request
    }
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
