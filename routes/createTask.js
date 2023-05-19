const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const Task = require("../models/Task");
const TaskGroup = require("../models/TaskGroup");

const express = require("express");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  const taskReq = req.body;
  if (!taskReq.grpId || !taskReq.taskTitle) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  try {
    let workspace = req.workspace;
    const taskGrp = await TaskGroup.findOne({
      _id: taskReq.grpId,
    });
    if (!taskGrp) {
      return res.status(404).json({ error: "Task group not found!" });
    }
    const prevTasks = taskGrp.tasks;
    let task;
    if (taskReq.taskId) {
      task = Task.findOne({ _id: taskReq.taskId });
      if (!task) {
        return res.status(404).json({ error: "Task  not found!" });
      }
    } else {
      task = new Task();
    }
    for (let k in taskReq) {
      if (taskReq[k]) {
        task[k] = taskReq[k];
      }
    }
    task.workspace = workspace._id;

    const taskResult = await task.save();
    const taskInfo = { ...task, id: taskResult._id };

    taskGrp.tasks = [...prevTasks, taskInfo];
    console.log(taskGrp);
    const result = await taskGrp.save();
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
