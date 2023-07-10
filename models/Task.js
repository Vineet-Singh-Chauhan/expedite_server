const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Workspace",
    },
    grpId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "TaskGroup",
    },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDate: { type: Date },
    taskDesc: { type: String },
    taskStatus: { type: String, default: "Not Started" },
    taskTags: [String],
    taskTitle: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
