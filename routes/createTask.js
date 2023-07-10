const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const Task = require("../models/Task");
const TaskGroup = require("../models/TaskGroup");

const express = require("express");
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
      const task = await Task.findOneAndUpdate(
        { _id: taskReq._id },
        {
          ...taskReq,
        }
      );
      if (!task) {
        return res.status(404).json({ error: "Task  not found!" });
      }
    } else {
      const createdTask = await Task.create({
        ...taskReq,
        workspace: req.workspace,
      });
      const taskGrp = await TaskGroup.findOneAndUpdate(
        { _id: taskReq.grpId },
        { $push: { tasks: createdTask._id } }
      );
    }
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
