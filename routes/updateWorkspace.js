const express = require("express");
const WorkspaceSchema = require("../models/WorkspaceSchema");
const isWorkspaceAdmin = require("../middleware/isWorkspaceAdmin");
const router = express.Router();
router.post("/", isWorkspaceAdmin, async (req, res) => {
  const name = req.body.name;
  const about = req.body.about;
  try {
    const workspace = await WorkspaceSchema.findOne({
      $and: [{ _id: req.workspace }, { admin: req.user.id }],
    }).exec();
    if (name) {
      workspace.name = name;
    }
    if (about) {
      workspace.about = about;
    }
    const result = await workspace.save();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
