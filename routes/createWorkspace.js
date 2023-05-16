const UserSchema = require("../models/UserSchema");
const WorkspaceSchema = require("../models/WorkspaceSchema");

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const workspaceName = req.body.workspaceName;
  const adminId = req.user.id;
  console.log(workspaceName, adminId);

  if (!workspaceName || !adminId) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }
  const admin = await UserSchema.findOne({ _id: adminId }).exec();
  if (!admin) {
    return res.status(401);
  }
  console.log(admin);
  try {
    const result = await WorkspaceSchema.create({
      name: workspaceName,
      adminId,
    });
    console.log(result);
    const prevWorkspaces = admin.workspaces;
    console.log(prevWorkspaces);
    const newWorkspaceInfo = {
      id: result._id,
      name: workspaceName,
    };
    const newWorkspaceArray = [...prevWorkspaces, newWorkspaceInfo];
    admin.workspaces = newWorkspaceArray;
    const result2 = await admin.save();
    console.log(result2);
    res.status(201).json({ id: result._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
