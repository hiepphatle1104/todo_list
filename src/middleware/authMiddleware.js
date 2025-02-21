import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler.js";

const authMiddleware = async (req, res, next) => {
	try {
		// Get token
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) throw new AppError("Unauthorized!", 401);
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		next(error);
	}
};

export default authMiddleware;
