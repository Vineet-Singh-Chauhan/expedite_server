require("dotenv").config();
const express = require("express");
const isWorkspaceAdmin = require("../middleware/isWorkspaceAdmin");
const { emailregex } = require("../config/regex");
const sendMail = require("../config/nodemailer");
const router = express.Router();
const jwt = require("jsonwebtoken");
const WorkspaceSchema = require("../models/WorkspaceSchema");
router.post("/", isWorkspaceAdmin, async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }
  if (!emailregex.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address" });
  }

  try {
    const workspace = await WorkspaceSchema.findOne({
      _id: req.workspace,
      invitedMembers: { $ne: email },
    }).populate({
      path: "members",
      match: { email: { $eq: email } },
    });
    // console.log("members --->", workspace?.members); // provided above is true, if this does not exist, person is already a member
    // console.log("workspace  --->", workspace); // if doesnot exists ,  member is already invited

    if (workspace !== null && workspace?.members.length !== 0) {
      return res.status(400).json({
        error: "User with this email id already a member of this workspace",
      });
    }
    if (workspace === null) {
      return res.status(400).json({
        error: "User with this email id already  invited on this workspace",
      });
    }
    const updatedWorkspace = await WorkspaceSchema.findOneAndUpdate(
      {
        _id: workspace._id,
      },
      {
        $addToSet: { invitedMembers: email },
      }
    );

    const payload = {
      workspaceId: updatedWorkspace._id,
      email: email,
    };
    const invitationInfo = jwt.sign(
      payload,
      process.env.INVITATION_TOKEN_SECRET
    );
    const invitationUrl = `${process.env.BASE_URL}/invite/${invitationInfo}/`;

    const emailStat = await sendMail({
      from: process.env.MAIL_ID,
      to: email,
      subject: "invitation mail",
      text: invitationUrl,
      html: `<ul><li>api for invitation left</li></ul><br/><a href="${invitationUrl}">Accept Invite</a>`,
    });
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
