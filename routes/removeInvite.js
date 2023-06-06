const express = require("express");
const isWorkspaceAdmin = require("../middleware/isWorkspaceAdmin");
const { emailregex } = require("../config/regex");
const sendMail = require("../config/nodemailer");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/UserSchema");
router.post("/", isWorkspaceAdmin, async (req, res) => {
  const userEmail = req.body.email;
  const workspace = req.workspace;

  if (!userEmail) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  try {
    const members = workspace.members;
    const invitees = workspace.invitedMembers;

    const isWorkspaceMember = members.some((e) => e.email === userEmail);
    const isInvited = invitees.some((e) => e === userEmail);
    if (isWorkspaceMember) {
      return res.status(400).json({
        error: "User with this email has accepted the invitation",
      });
    }
    if (!isInvited) {
      return res.status(400).json({
        error: "This invitation cannot be found !",
      });
    }

    const newInvitees = invitees.filter((e) => e !== userEmail);
    workspace.invitedMembers = newInvitees;
    const result = await workspace.save();

    // const user = await UserSchema.findOne({ email: userEmail }).exec();

    // const workspaceArray = user.workspaces;
    // console.log(workspaceArray);

    // const newWorkspaceArray = workspaceArray.filter(
    //   (e) => e.id.toString() !== workspace.id.toString()
    // );
    // user.workspaces = newWorkspaceArray;
    // const resultUser = user.save();

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
