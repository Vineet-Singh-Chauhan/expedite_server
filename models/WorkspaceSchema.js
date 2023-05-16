const mongoose = require("mongoose");
const { Schema } = mongoose;
const { workspaceInfo, taskInfo, membersInfo } = require("./shortSchemas");
ObjectId = Schema.ObjectId;
const WorkspaceSchema = new Schema({
  name: { type: String, required: true },
  adminId: { type: ObjectId, required: true },
  members: [membersInfo],
  tasks: [taskInfo],
  notifications: [{ body: String, date: Date }],
  about: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Workspace", WorkspaceSchema);
