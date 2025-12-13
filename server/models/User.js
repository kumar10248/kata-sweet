const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: String,
    fullName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
