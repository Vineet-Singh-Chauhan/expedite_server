const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  workspaces: [],
  tasks: [],
  notifications: [{ body: String, date: Date }],
  about: String,
  refreshToken: [String],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
