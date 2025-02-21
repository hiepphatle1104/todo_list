const errorHandler = (err, req, res, next) => {
	res.status(err.status || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
};

class AppError extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}

export { errorHandler, AppError };
