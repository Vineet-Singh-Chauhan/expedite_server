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
    // console.log(foundUser.password);
    // console.log(passwordCompare);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Enter valid email and password!" }); //bad request
    }
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
