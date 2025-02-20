import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// Sign in
router.post("/sign-in", async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Check data exist
		if (!email)
			return res.status(400).json({ message: "Email field is missing" });

		if (!password)
			return res.status(400).json({ message: "Password field is missing" });

		// Check exist user
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "User not found!" });

		// Compare password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(401).json({ message: "Invalid credentials!" });

		// Create token
		// TODO: error handling for jwt secret key
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		// Return token, user
		res.status(200).json({
			message: "Sign in successfully!",
			token,
		});
	} catch (error) {
		next(error);
	}
});

// Sign up
router.post("/sign-up", async (req, res, next) => {
	try {
		const { username, email, password } = req.body;

		if (!username)
			return res.status(400).json({ message: "Username field is missing" });

		// Check data exist
		if (!email)
			return res.status(400).json({ message: "Email field is missing" });

		if (!password)
			return res.status(400).json({ message: "Password field is missing" });

		// Check user exist
		const existUser = await User.findOne({ email });
		if (existUser)
			return res.status(400).json({ message: "User already exist!" });

		// Create new user
		const user = new User({
			username,
			email,
			password,
		});

		await user.save();

		res.status(201).json({ message: "User is created!" });
	} catch (error) {
		next(error);
	}
});

export default router;
