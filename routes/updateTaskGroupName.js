const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const TaskGroup = require("../models/TaskGroup");

const express = require("express");
const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  const name = req.body.name;
  const grpId = req.body.grpId;
  if (!grpId || !name) {
    return res
      .status(400)
      .json({ error: "Please fill all the mandatory fields!" });
  }

  try {
    const taskGrp = await TaskGroup.findByIdAndUpdate(grpId, {
      name: name,
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
