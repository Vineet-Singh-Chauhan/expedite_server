require("dotenv").config();
const express = require("express");
const isWorkspaceAdmin = require("../middleware/isWorkspaceAdmin");
const { emailregex } = require("../config/regex");
const sendMail = require("../config/nodemailer");
const router = express.Router();
const jwt = require("jsonwebtoken");
router.post("/", isWorkspaceAdmin, async (req, res) => {
  const email = req.body.email;
  const workspace = req.workspace;
  if (!email) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }
  if (!emailregex.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address" });
  }

  try {
    const members = workspace.members;
    const isWorkspaceMember = members.some((e) => e.email === email);

    if (isWorkspaceMember) {
      return res.status(400).json({
        error: "User with this email id already a member of this workspace",
      });
    }

    const invitees = workspace.invitedMembers;

    if (invitees.includes(email)) {
      return res.status(400).json({
        error: "User with this email id already  invited on this workspace",
      });
    }

    const payload = {
      workspaceId: workspace._id,
      email: email,
    };
    const invitationInfo = jwt.sign(
      payload,
      process.env.INVITATION_TOKEN_SECRET
    );
    const invitationUrl = `${process.env.BASE_URL}/invite/${invitationInfo}/`;
    workspace.invitedMembers = [...invitees, email];
    const result = workspace.save();
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
