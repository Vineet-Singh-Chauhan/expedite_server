const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },
    password: { type: String, required: true },
    workspaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
      },
    ],
    about: { type: String, default: "" },
    refreshToken: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
