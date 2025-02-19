import { Router } from "express";
import Task from "../models/Task.js";
import taskMiddleware from "../middleware/taskMiddleware.js";

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
		res.status(200).json(req.task);
	} catch (error) {
		next(error);
	}
});

// Create new task
router.post("/", async (req, res, next) => {
	try {
		// TODO: Validate input
		const { title, content, status } = req.body;

		const task = new Task({
			title,
			content,
			status,
			userId: req.userId,
		});

		await task.save();

		res.status(200).json({ message: "Task is created!" });
	} catch (error) {
		next(error);
	}
});

// Update task
router.put("/:id", taskMiddleware, async (req, res, next) => {
	try {
		const { title, content, status } = req.body;
		req.task.title = title;
		req.task.content = content;
		req.task.status = status;
		await req.task.save();

		res.status(200).json({ message: "Task is updated!" });
	} catch (error) {
		next(error);
	}
});

// Delete task
router.delete("/:id", taskMiddleware, async (req, res, next) => {
	try {
		await req.task.deleteOne();

		res.status(200).json({ message: "Task is deleted!" });
	} catch (error) {
		next(error);
	}
});

export default router;
