const express = require("express");
const isWorkspaceAdmin = require("../middleware/isWorkspaceAdmin");
const { emailregex } = require("../config/regex");
const sendMail = require("../config/nodemailer");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/UserSchema");
router.post("/", isWorkspaceAdmin, async (req, res) => {
  const userId = req.body.userId;
  const workspace = req.workspace;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  try {
    const members = workspace.members;

    const isWorkspaceMember = members.some((e) => e.id.toString() === userId);

    if (!isWorkspaceMember) {
      return res.status(400).json({
        error: "User with this email id not a member of this workspace",
      });
    }
    if (userId === workspace.adminId.toString()) {
      return res.status(400).json({
        error: "Cannot remove admin of workspace",
      });
    }

    console.log(members);
    const newMembersArray = members.filter((e) => e.id.toString() !== userId);
    workspace.members = newMembersArray;
    const result = await workspace.save();

    const user = await UserSchema.findOne({ _id: userId }).exec();

    const workspaceArray = user.workspaces;
    console.log(workspaceArray);

    const newWorkspaceArray = workspaceArray.filter(
      (e) => e.id.toString() === workspace.id.toString()
    );
    user.workspaces = newWorkspaceArray;
    const resultUser = user.save();

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
