const UserSchema = require("../models/UserSchema");
const WorkspaceSchema = require("../models/WorkspaceSchema");

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const workspaceName = req.body.workspaceName;
  const adminId = req.user.id;
  if (!workspaceName || !adminId) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }
  const admin = await UserSchema.findOne({ _id: adminId }).exec();
  if (!admin) {
    return res.status(401);
  }
  try {
    const createdWorkspace = await WorkspaceSchema.create({
      name: workspaceName,
      admin: adminId,
      members: [adminId],
    });
    const userUpdate = await UserSchema.findOneAndUpdate(
      { _id: adminId },
      { $push: { workspaces: createdWorkspace._id } }
    );
    res.status(201).json({ id: createdWorkspace._id, name: workspaceName });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
