const mongoose = require("mongoose");
const { Schema } = mongoose;
const { taskInfo, workspaceInfo } = require("./shortSchemas");
// const Task = require("./Task");

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  workspaces: [workspaceInfo],
  tasks: [taskInfo],
  notifications: [{ body: String, date: Date }],
  about: { type: String, default: "" },
  refreshToken: [String],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
