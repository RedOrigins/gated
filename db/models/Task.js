const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  data: {
    type: Object,
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

