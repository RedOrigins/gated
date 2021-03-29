const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  school: {
    type: mongoose.Types.ObjectId, // Reference to school object
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
    match: /^[a-zA-Z0-9 ]+$/, // Alphanumeric characters
  },
  group: {
    type: String,
    required: true,
    default: "student",
    enum: ["staff", "student"], // Validation of given group name
  },
  password: {
    type: String,
    required: true,
  },
});

// Compound unique key of schoolId and name
userSchema.index(
  {
    school: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
