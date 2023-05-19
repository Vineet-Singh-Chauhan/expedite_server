const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const TaskGroup = require("../models/TaskGroup");
const UserSchema = require("../models/UserSchema");
const WorkspaceSchema = require("../models/WorkspaceSchema");

const express = require("express");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  const grpName = req.body.grpName;
  if (!grpName) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  try {
    let workspace = req.workspace;
    const taskGrp = await TaskGroup.create({
      name: grpName,
      workspace: workspace._id,
    });
    workspace.taskGroups = [
      ...workspace.taskGroups,
      { id: taskGrp._id, name: taskGrp.name },
    ];
    const result = await workspace.save();
    res.status(201).json({ id: taskGrp._id, name: taskGrp.name });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
