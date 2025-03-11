import { Schema, model } from "mongoose";

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["done", "in-progress", "todo", "on-hold"],
    default: "todo",
  },

  deadline: {
    type: Date,
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
  },
});

const Task = model("Task", taskSchema);
export default Task;
