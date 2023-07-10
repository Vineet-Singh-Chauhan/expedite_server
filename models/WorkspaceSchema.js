const mongoose = require("mongoose");
const { Schema } = mongoose;

const WorkspaceSchema = new Schema(
  {
    name: { type: String, required: true },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    invitedMembers: [String],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    taskGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "TaskGroup" }],
    notifications: [{ body: String, date: Date }],
    about: { type: String },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workspace", WorkspaceSchema);
