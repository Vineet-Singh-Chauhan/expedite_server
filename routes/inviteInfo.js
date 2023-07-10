require("dotenv");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const WorkspaceSchema = require("../models/WorkspaceSchema");
const UserSchema = require("../models/UserSchema");
router.post("/", async (req, res) => {
  const info = req.body.inviteInfo;
  if (!info) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }
  try {
    jwt.verify(
      info,
      process.env.INVITATION_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Invalid request" });
        }
        const workspaceId = decoded.workspaceId;
        const email = decoded.email;
        if (!email || !workspaceId) {
          return res
            .status(400)
            .json({ error: "Please fill all the mandatory fields!" });
        }
        const workspace = await WorkspaceSchema.findOne({
          _id: workspaceId,
          invitedMembers: email,
        }).populate({
          path: "members",
          match: { email: email },
        });

        if (workspace === null) {
          return res.status(400).json({
            error: "Link Expired!",
          });
        }
        if (workspace?.members.length !== 0) {
          //this will never haapen
          return res.status(400).json({
            error: "User with this email id already a member on this workspace",
          });
        }

        const user = await UserSchema.findOne({ email: email });
        if (!user) {
          return res.status(401).json({ error: "Create an account first" });
        }

        const payload = {
          workspaceName: workspace.name,
          userName: user.firstName,
        };

        res.json(payload);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
