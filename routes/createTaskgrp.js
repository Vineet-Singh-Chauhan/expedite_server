const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const TaskGroup = require("../models/TaskGroup");

const express = require("express");
const WorkspaceSchema = require("../models/WorkspaceSchema");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  const grpName = req.body.grpName.trim();
  if (!grpName) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  try {
    const taskGrp = await TaskGroup.create({
      name: grpName,
      workspace: req.workspace,
    });
    const updatedWorkspace = await WorkspaceSchema.findOneAndUpdate(
      { _id: req.workspace },
      { $push: { taskGroups: taskGrp._id } }
    );

    res.status(201).json(taskGrp);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
