const mongoose = require("mongoose");
const { Schema } = mongoose;
const { taskInfo, membersInfo, taskGrpInfo } = require("./shortSchemas");
ObjectId = Schema.ObjectId;
const WorkspaceSchema = new Schema({
  name: { type: String, required: true },
  adminId: { type: ObjectId, required: true },
  members: [membersInfo],
  invitedMembers: [String],
  // tasks: [taskInfo],
  taskGroups: [taskGrpInfo],
  notifications: [{ body: String, date: Date }],
  about: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Workspace", WorkspaceSchema);
