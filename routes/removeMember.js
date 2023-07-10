const express = require("express");
const isWorkspaceAdmin = require("../middleware/isWorkspaceAdmin");
const router = express.Router();
const UserSchema = require("../models/UserSchema");
const WorkspaceSchema = require("../models/WorkspaceSchema");
router.post("/", isWorkspaceAdmin, async (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  try {
    const workspace = await WorkspaceSchema.findOneAndUpdate(
      { _id: req.workspace, members: userId, admin: { $ne: userId } },
      {
        $pull: { members: userId },
      }
    );

    if (!workspace) {
      return res.status(400).json({
        error: "Cannot remove admin of workspace",
      });
    }

    const user = await UserSchema.findOneAndUpdate(
      { _id: userId },
      { $pull: { workspaces: req.workspace } }
    ).exec();

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
