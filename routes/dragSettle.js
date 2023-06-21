const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const Task = require("../models/Task");
const TaskGroup = require("../models/TaskGroup");

const express = require("express");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  const { toPos, fromGrp, toGrp, taskId } = req.body;
  console.log(toPos, fromGrp, toGrp, taskId);
  if (!fromGrp || !taskId || !toGrp || !toPos.toString()) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields here!" });
  }

  try {
    let workspace = req.workspace;
    const fromTaskGrp = await TaskGroup.findOne({
      _id: fromGrp,
    });
    const toTaskGrp = await TaskGroup.findOne({
      _id: toGrp,
    });
    if (!fromTaskGrp || !toTaskGrp) {
      return res.status(404).json({ error: "Task group not found!" });
    }
    const prevTasksOfFromGrp = fromTaskGrp.tasks;
    console.log(prevTasksOfFromGrp);
    const newTasksOfFromGrp = prevTasksOfFromGrp.filter((e) => e.id != taskId);
    const taskInfo = prevTasksOfFromGrp.find((e) => (e.id = taskId));
    console.log("Lne 31", taskInfo);
    const prevTasksOfToGrp = toTaskGrp.tasks;
    // const task = await  Task.findOne({
    //     _id:taskId
    // })
    prevTasksOfToGrp.splice(toPos, 0, taskInfo);
    // let task;
    console.log(taskInfo);
    toTaskGrp.tasks = prevTasksOfToGrp;
    const result = await toTaskGrp.save();
    fromTaskGrp.tasks = newTasksOfFromGrp;
    const result2 = await fromTaskGrp.save();

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
