import jwt from "jsonwebtoken";
import { ErrorHandler } from "./errorHandler.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Get token
    const token = req.cookies.token;
    if (!token) return ErrorHandler(res, "Unauthorized!", 401);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
