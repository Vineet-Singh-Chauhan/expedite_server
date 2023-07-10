const express = require("express");
const isWorkspaceAdmin = require("../middleware/isWorkspaceAdmin");
const router = express.Router();
const WorkspaceSchema = require("../models/WorkspaceSchema");
router.post("/", isWorkspaceAdmin, async (req, res) => {
  const userEmail = req.body.email;

  if (!userEmail) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  try {
    const updatedWorkspace = await WorkspaceSchema.findOneAndUpdate(
      {
        _id: req.workspace,
      },
      {
        $pull: { invitedMembers: userEmail },
      }
    );
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
