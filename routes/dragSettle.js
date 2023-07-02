const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const Task = require("../models/Task");
const TaskGroup = require("../models/TaskGroup");

const express = require("express");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  const { toPos, fromGrp, toGrp, taskId, fromPos } = req.body;
  console.log(toPos, fromGrp, toGrp, taskId);
  if (!fromGrp || !taskId || !toGrp || !toPos.toString()) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields here!" });
  }

  try {
    if (fromGrp != toGrp) {
      const fromTaskGrp = await TaskGroup.findOne({
        _id: fromGrp,
      });
      const toTaskGrp = await TaskGroup.findOne({
        _id: toGrp,
      });
      if (!fromTaskGrp || !toTaskGrp) {
        return res.status(404).json({ error: "Task group not found!" });
      }
      let prevTasksOfFromGrp = fromTaskGrp.tasks;
      console.log(prevTasksOfFromGrp);
      const taskInfo = prevTasksOfFromGrp.find((e) => e.id == taskId);
      console.log("Lne 31", taskInfo);
      let prevTasksOfToGrp = toTaskGrp.tasks;
      prevTasksOfFromGrp.splice(fromPos, 1);
      prevTasksOfToGrp.splice(toPos, 0, taskInfo);
      fromTaskGrp.tasks = prevTasksOfFromGrp;
      toTaskGrp.tasks = prevTasksOfToGrp;
      const result = await toTaskGrp.save();
      const result2 = await fromTaskGrp.save();
    } else {
      console.log("1 step");
      if (toPos == fromPos) {
        return res.sendStatus(200);
      }
      const TaskGrp = await TaskGroup.findOne({
        _id: fromGrp,
      });
      if (!TaskGrp) {
        return res.status(404).json({ error: "Task group not found!" });
      }
      let prevTasksOfGrp = TaskGrp.tasks;
      console.log(prevTasksOfGrp);
      const taskInfo = prevTasksOfGrp.find((e) => e.id == taskId);
      console.log("takinfo-->", taskInfo);
      prevTasksOfGrp.splice(fromPos, 1);
      // if (fromPos < toPos && toPos != 0) {
      //   console.log("2 step");
      //   prevTasksOfGrp.splice(toPos - 1, 0, taskInfo);
      // } else {
      console.log("3 step");
      prevTasksOfGrp.splice(toPos, 0, taskInfo);
      // }
      console.log("final:", prevTasksOfGrp);
      TaskGrp.tasks = prevTasksOfGrp;
      const result = await TaskGrp.save();
    }

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
