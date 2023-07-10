const express = require("express");
const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const Task = require("../models/Task");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  try {
    const taskGroups = await WorkspaceSchema.findById(
      req.workspace,
      "taskGroups"
    ).populate("taskGroups");
    const tasks = await Task.populate(taskGroups, {
      path: "TaskGroup.tasks",
    });
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
