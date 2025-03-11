import { Router } from "express";
import User from "../models/User.js";
import { signInValidate, signUpValidate } from "../utils/validate.data.js";
import { AppError } from "../middleware/errorHandler.js";
import authMiddleware from "../middleware/authMiddleware.js";

const cookieOptions = {
  httpOnly: true,
  maxAge: 3600000, // 1 giờ
  sameSite: "Lax",
  secure: false,
};

const router = Router();

// Sign in
router.post("/sign-in", async (req, res, next) => {
  try {
    // Validate data
    const validate = await signInValidate.safeParseAsync(req.body);
    if (!validate.success) throw new AppError("Validate failed!", 400);

    const { email, password } = req.body;

    // Check exist user
    const user = await User.findOne({ email });
    if (!user) throw new AppError("User not found!", 404);

    // Compare password
    await user.comparePassword(password);

    // Create token
    // todo: error handling for jwt secret key
    const token = user.createToken();

    res.cookie("token", token, cookieOptions);

    // Return token, user
    res.status(200).json({
      success: true,
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
    // Validate data
    const validate = await signUpValidate.safeParseAsync(req.body);
    if (!validate.success) throw new AppError("Validate failed!", 400);

    const { email } = req.body;

    // Check user exist
    const existUser = await User.findOne({ email });
    if (existUser) throw new AppError("User already exist!", 400);

    // Create new user
    const user = new User(req.body);
    await user.save();

    res.status(201).json({ success: true, message: "User is created!" });
  } catch (error) {
    next(error);
  }
});

// Sign out
router.get("/sign-out", authMiddleware, async (req, res, next) => {
  try {
    res.clearCookie("token", { path: "/" });
    res.status(200).json({ success: true, message: "Sign out successfully!" });
  } catch (error) {
    next(error);
  }
});

// Validate token
router.get("/validate", authMiddleware, async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Authenticated!",
    });
  } catch (error) {
    next(error);
  }
});
export default router;
