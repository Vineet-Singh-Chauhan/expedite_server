const express = require("express");
const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const Task = require("../models/Task");
const WorkspaceSchema = require("../models/WorkspaceSchema");
const UserSchema = require("../models/UserSchema");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  try {
    let taskGroups = await WorkspaceSchema.findById(
      req.workspace,
      "taskGroups name"
    ).populate("taskGroups");
    taskGroups = await Task.populate(taskGroups, {
      path: "taskGroups.tasks",
    });
    taskGroups = await UserSchema.populate(taskGroups, {
      path: "taskGroups.tasks.assignees",
    });
    res.json(taskGroups);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
