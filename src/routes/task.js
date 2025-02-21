import { Router } from "express";
import Task from "../models/Task.js";
import taskMiddleware from "../middleware/taskMiddleware.js";
import { taskValidate } from "../utils/validate.data.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get all tasks
router.get("/", async (req, res, next) => {
	try {
		const tasks = await Task.find({ userId: req.userId }).select("-userId");

		if (tasks.length === 0)
			return res.status(404).json({ message: "You doesn't have any tasks" });

		res.status(200).json(tasks);
	} catch (error) {
		next(error);
	}
});

// Get task by id
router.get("/:id", taskMiddleware, async (req, res, next) => {
	try {
		const task = await Task.findById({ _id: req.taskId }).select("-userId");
		res.status(200).json(task);
	} catch (error) {
		next(error);
	}
});

// Create new task
router.post("/", async (req, res, next) => {
	try {
		// Validate data
		const validate = await taskValidate.safeParseAsync(req.body);
		if (!validate.success) throw new AppError("Missing some fields", 400);

		// Create new task
		const task = new Task({ ...req.body, userId: req.userId });
		await task.save();

		res.status(200).json({ message: "Task is created!" });
	} catch (error) {
		next(error);
	}
});

// Update task
router.put("/:id", taskMiddleware, async (req, res, next) => {
	try {
		// Validate data
		const validate = await taskValidate.safeParseAsync(req.body);
		if (!validate.success) throw new AppError("Missing some fields", 400);

		// Update task
		await Task.updateMany({ _id: req.taskId }, { $set: { ...req.body } });

		res.status(200).json({ message: "Task is updated!" });
	} catch (error) {
		next(error);
	}
});

// Delete task
router.delete("/:id", taskMiddleware, async (req, res, next) => {
	try {
		await Task.findByIdAndDelete({ _id: req.taskId });

		res.status(200).json({ message: "Task is deleted!" });
	} catch (error) {
		next(error);
	}
});

export default router;
