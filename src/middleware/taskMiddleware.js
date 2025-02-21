import Task from "../models/Task.js";

// Task handler
const taskMiddleware = async (req, res, next) => {
	const task = await Task.findById(req.params.id);

	if (!task) return res.status(404).json({ message: "Task not found!" });

	if (task.userId.toString() !== req.userId)
		return res.status(406).json({ message: "This is not your task" });

	req.taskId = task._id;
	next();
};

export default taskMiddleware;
