const express = require("express");
const WorkspaceSchema = require("../models/WorkspaceSchema");
const isWorkspaceUser = require("../middleware/isWorkspaceUser");
const UserSchema = require("../models/UserSchema");

const router = express.Router();

router.post("/", isWorkspaceUser, async (req, res) => {
  try {
    const workspace = req.workspace;
    const admin = await UserSchema.findOne({
      _id: workspace.adminId,
    }).exec();
    const adminName = admin.firstName + " " + admin.lastName;
    const data = { ...workspace._doc, adminName };
    res.json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
