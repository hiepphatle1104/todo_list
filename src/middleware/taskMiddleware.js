import Task from "../models/Task.js";
import { AppError } from "./errorHandler.js";

// Task handler
const taskMiddleware = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return ErrorHandler(res, "Task not found!", 404);

    if (task.userId.toString() !== req.userId)
      return ErrorHandler(res, "This is not your task", 406);

    req.taskId = task._id;
    next();
  } catch (error) {
    next(error);
  }
};

export default taskMiddleware;
