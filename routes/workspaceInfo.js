const express = require("express");
const WorkspaceSchema = require("../models/WorkspaceSchema");
const isWorkspaceUser = require("../middleware/isWorkspaceUser");

const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  try {
    const workspaceId = req.workspace;
    const workspace = await WorkspaceSchema.findById(workspaceId)
      .populate("admin", "firstName lastName")
      .populate("members", "firstName lastName email")
      .populate("taskGroups")
      .populate("tasks");
    res.json(workspace);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
