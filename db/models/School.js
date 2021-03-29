const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
    match: /^[a-zA-Z0-9 ]+$/, // Alphanumeric characters
  },
});

const School = mongoose.model("School", schoolSchema);

module.exports = School;

