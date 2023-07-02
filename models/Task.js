const mongoose = require("mongoose");
const { Schema } = mongoose;
const { membersInfo } = require("./shortSchemas");
ObjectId = Schema.ObjectId;
const TaskSchema = new Schema({
  workspace: { type: ObjectId, required: true },
  // grpId: { type: ObjectId, required: true },
  assignees: [membersInfo],
  dueDate: { type: Date },
  taskDesc: { type: String },
  taskStatus: { type: String, default: "Not Started" },
  taskTags: [String],
  taskTitle: { type: String, required: true },
});

module.exports = mongoose.model("Task", TaskSchema);
