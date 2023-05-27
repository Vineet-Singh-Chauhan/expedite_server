const express = require("express");
const WorkspaceSchema = require("../models/WorkspaceSchema");
const isWorkspaceAdmin = require("../middleware/isWorkspaceAdmin");
const UserSchema = require("../models/UserSchema");
const router = express.Router();
router.post("/", isWorkspaceAdmin, async (req, res) => {
  const name = req.body.name;
  const about = req.body.about;
  try {
    const user = await UserSchema.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(401);
    }
    const workspace = req.workspace;

    if (name) {
      workspace.name = name;
    }
    if (about) {
      workspace.about = about;
    }
    const prevWorkspaces = user.workspaces.filter(
      (e) => e.id.toString() !== workspace.id
    );
    user.workspaces = [
      ...prevWorkspaces,
      { id: workspace.id, name: workspace.name },
    ];
    const result = await workspace.save();
    const result2 = await user.save();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
