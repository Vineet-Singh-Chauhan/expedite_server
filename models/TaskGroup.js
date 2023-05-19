const mongoose = require("mongoose");
const { Schema } = mongoose;
const { taskInfo } = require("./shortSchemas");
// const Task = require("./Task");
ObjectId = Schema.ObjectId;
const TaskGroupSchema = new Schema({
  name: { type: String, required: true },
  workspace: { type: ObjectId, required: true },
  tasks: [taskInfo],
});

module.exports = mongoose.model("TaskGroup", TaskGroupSchema);
