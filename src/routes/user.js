import { Router } from "express";
import User from "../models/User.js";
import Task from "../models/Task.js";

const router = Router();

router.get("/", async (req, res, next) => {
	try {
		// User information
		const user = await User.findById(req.userId).select("-password");
		const tasks = await Task.find({ userId: req.userId }).select("-userId");

		if (!user) return res.status(404).json({ message: "Data not found!" });

		res.status(200).json({ user, tasks });
	} catch (error) {
		next(error);
	}
});

export default router;
