const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  task: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Task"
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  },
  state: {
    type: String,
    required: true,
    default: "uncompleted",
    enum: ["uncompleted", "correct", "incorrect"],
  }
});

resultSchema.index(
  {
    task: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;
