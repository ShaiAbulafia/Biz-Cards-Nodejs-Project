const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  biz: {
    type: Boolean,
    required: true,
  },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
