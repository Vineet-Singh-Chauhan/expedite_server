const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const Task = require("../models/Task");
const TaskGroup = require("../models/TaskGroup");

const express = require("express");
const UserSchema = require("../models/UserSchema");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  const taskReq = req.body;
  if (!taskReq.grpId || !taskReq.taskTitle.trim()) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  try {
    if (taskReq._id) {
      let task = await Task.findOneAndUpdate(
        { _id: taskReq._id },
        {
          ...taskReq,
        }
      );
      task = await UserSchema.populate(task, {
        path: "assignees",
      });
      if (!task) {
        return res.status(404).json({ error: "Task  not found!" });
      }
      return res.status(201).json(task);
    } else {
      let createdTask = await Task.create({
        ...taskReq,
        workspace: req.workspace,
      });
      const taskGrp = await TaskGroup.findOneAndUpdate(
        { _id: taskReq.grpId },
        { $push: { tasks: createdTask._id } }
      );
      createdTask = await UserSchema.populate(createdTask, {
        path: "assignees",
      });
      return res.status(201).json(createdTask);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
