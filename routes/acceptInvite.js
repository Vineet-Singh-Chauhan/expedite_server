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
        const workspace = await WorkspaceSchema.findOne({ _id: workspaceId });
        if (!workspace) {
          return res
            .status(403)
            .json({ error: "Workspace do not exist anymore" });
        }
        const invitedMembers = workspace.invitedMembers;
        if (!invitedMembers.includes(email)) {
          return res.status(403).json({ error: "Link expired!" });
        }
        const user = await UserSchema.findOne({ email: email });
        if (!user) {
          return res.status(403).json({ error: "Create an account first" });
        }
        console.log(loggedUser.id);
        if (user._id.toString() !== loggedUser.id.toString()) {
          return res.status(403).json({ error: "Log-in to continue" });
        }

        const members = workspace.members;

        const isWorkspaceMember = members.some((e) => e.email === email);

        if (isWorkspaceMember) {
          return res.status(400).json({
            error: "User with this email id already a member of this workspace",
          });
        }

        const invitees = workspace.invitedMembers;

        if (!invitees.includes(email)) {
          return res.status(400).json({
            error: "Link Expired!",
          });
        }

        workspace.members = [
          ...members,
          {
            id: user._id,
            name: user.firstName + " " + user.lastName,
            email: user.email,
          },
        ];
        const newInvitees = invitees.filter((e) => e !== user.email);
        workspace.invitedMembers = newInvitees;
        console.log(newInvitees);
        await workspace.save();
        const prevWorkspaces = user.workspaces;
        user.workspaces = [
          ...prevWorkspaces,
          { id: workspace._id, name: workspace.name },
        ];
        await user.save();
        console.log(workspace._id.toString());
        res.status(204).json({ workspaceId: workspace._id.toString() });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
