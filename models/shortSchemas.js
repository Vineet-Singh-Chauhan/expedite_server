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
  title: { type: String, required: true },
  tags: [{ type: String, title: String }],
  date: { type: Date, default: Date.now },
  assignee: [membersInfo],
  desc: { type: String },
});
const workspaceInfo = new Schema({
  id: { type: ObjectId, required: true },
  name: { type: String, required: true },
});

module.exports = { membersInfo, taskInfo, workspaceInfo };
