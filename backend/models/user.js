const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  role: { type: String, default: "basic", required: true },
  imageUrl: { type: String },
  function: { type: String },
  bio: { type: String, maxlenght: 1024 },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("user", userSchema);
