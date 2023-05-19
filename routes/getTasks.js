// const UserSchema = require("../models/UserSchema");
// const WorkspaceSchema = require("../models/WorkspaceSchema");

const express = require("express");
const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  // const workspaceId = req.body.workspaceId;
  // const userId = req.user.id;

  // if (!workspaceId) {
  //   return res.status(404).json({ error: "Workspace not found !" });
  // }
  try {
    // const workspace = await WorkspaceSchema.findOne({
    //   _id: workspaceId,
    // }).exec();
    // if (!workspace) {
    //   return res.status(404);
    // }
    // const members = workspace.members;
    // const found = members.some((el) => el.id == userId);
    // if (!found) {
    // return res.sendStatus(401);
    // }
    const tasks = req.workspace.taskGroups;
    // console.log(tasks);
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
