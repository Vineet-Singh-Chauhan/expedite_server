const mongoose = require("mongoose");
const { Schema } = mongoose;
ObjectId = Schema.ObjectId;
const membersInfo = new Schema({
  id: { type: ObjectId, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});
const taskInfo = new Schema({
  id: { type: ObjectId, required: true },
  workspace: { type: ObjectId, required: true },
  // grpId: { type: ObjectId, required: true },
  assignees: [membersInfo],
  dueDate: { type: Date },
  taskDesc: { type: String },
  taskStatus: { type: String, default: "Not Started" },
  taskTags: [String],
  taskTitle: { type: String, required: true },
});
const taskGrpInfo = new Schema({
  id: { type: ObjectId, required: true },
  name: { type: String, required: true },
});
const workspaceInfo = new Schema({
  id: { type: ObjectId, required: true },
  name: { type: String, required: true },
});

module.exports = { membersInfo, taskInfo, workspaceInfo, taskGrpInfo };
