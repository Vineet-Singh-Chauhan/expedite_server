// const UserSchema = require("../models/UserSchema");
// const WorkspaceSchema = require("../models/WorkspaceSchema");

const express = require("express");
const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const TaskGroup = require("../models/TaskGroup");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  try {
    const taskGroupInfo = req.body.taskGroupInfo;
    const taskGroup = await TaskGroup.findOne({ _id: taskGroupInfo.id });
    const tasks = taskGroup?.tasks || [];
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
