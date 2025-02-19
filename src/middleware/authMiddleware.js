import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
	// Get token
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ message: "Unauthorized!" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		next(error);
	}
};

export default authMiddleware;
