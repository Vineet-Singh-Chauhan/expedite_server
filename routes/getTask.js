// const UserSchema = require("../models/UserSchema");
// const WorkspaceSchema = require("../models/WorkspaceSchema");

const express = require("express");
const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const TaskGroup = require("../models/TaskGroup");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  try {
    const taskGrps = req.workspace.taskGroups;
    const workspaceInfo = {
      name: req.workspace.name,
      id: req.workspace.id,
    };
    let allTasks = [];
    for (const e of taskGrps) {
      const taskGroup = await TaskGroup.findOne({ _id: e.id });
      const tasks = taskGroup?.tasks || [];
      allTasks = [...allTasks, { name: e.name, id: e.id, items: tasks }];
    }
    res.json({ workspaceInfo, tasks: allTasks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
