const express = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const UserSchema = require("../models/UserSchema");
const router = express.Router();

router.post("/", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dob = req.body.dob;
  const about = req.body.about;
  const currentPassword = req.body.currPassword;
  const newPassword = req.body.newPassword;
  try {
    const user = await UserSchema.findOne({ _id: req.user.id });
    if (!user) {
      return res.sendStatus(401);
    }
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }

    if (dob) {
      const date = new Date(dob);
      user.dob = date;
    }
    if (about) {
      user.about = about;
    }
    if (currentPassword || newPassword) {
      if (currentPassword && newPassword) {
        const passwordCompare = await bcryptjs.compare(
          currentPassword,
          user.password
        );
        if (!passwordCompare) {
          return res.status(400).json({ error: "Enter valid password!" }); //bad request
        }

        //encrypt password
        const salt = await bcryptjs.genSalt(10);
        const hashedPwd = await bcryptjs.hash(newPassword, salt);
        user.password = hashedPwd;

        const payload = {
          user: {
            id: user._id,
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

        // invalidating all token
        let newRefreshTokenArray = [newRefreshToken];
        res.clearCookie("jwt", {
          httpOnly: true,
        });

        user.refreshToken = newRefreshTokenArray;

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken });
      } else {
        return res.status(400).json({ error: "Please fill all the fields" });
      }
    }
    const result = await user.save();
    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
