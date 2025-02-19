import { Router } from "express";
import authRoute from "./auth.js";
import userRoute from "./user.js";
import taskRoute from "./task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Auth route
router.use("/auth", authRoute);

// User route
router.use("/users", authMiddleware, userRoute);

// Task route
router.use("/tasks", authMiddleware, taskRoute);
export default router;
