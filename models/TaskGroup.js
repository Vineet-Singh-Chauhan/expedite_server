const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskGroupSchema = new Schema(
  {
    name: { type: String, required: true },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Workspace",
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TaskGroup", TaskGroupSchema);
