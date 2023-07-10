require("dotenv");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const WorkspaceSchema = require("../models/WorkspaceSchema");
const UserSchema = require("../models/UserSchema");
router.post("/", async (req, res) => {
  const info = req.body.inviteInfo;
  const loggedUser = req.user;
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
        const user = await UserSchema.findOneAndUpdate(
          {
            _id: loggedUser.id,
            email: email,
          },
          {
            $push: { workspaces: workspaceId },
          }
        );
        if (!user) {
          return res.status(403).json({ error: "Link expired!" });
        }

        const workspace = await WorkspaceSchema.findOneAndUpdate(
          { _id: workspaceId, invitedMembers: email },
          {
            $push: { members: user._id },
            $pull: { invitedMembers: user.email },
          }
        );

        if (!workspace) {
          return res.status(403).json({ error: "Link Expired!" });
        }

        res.status(204).json({ workspaceId: workspace._id.toString() });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
