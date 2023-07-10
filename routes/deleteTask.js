const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const Task = require("../models/Task");
const TaskGroup = require("../models/TaskGroup");

const express = require("express");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  const taskId = req.body.taskId;
  const grpId = req.body.grpId;
  if (!grpId || !taskId) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  try {
    const taskGrp = await TaskGroup.findOneAndUpdate(
      {
        _id: grpId,
      },
      {
        $pull: { tasks: taskId },
      }
    );
    if (!taskGrp) {
      return res.status(404).json({ error: "Task group not found!" });
    }
    const deleteResult = await Task.deleteOne({
      _id: taskId,
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
