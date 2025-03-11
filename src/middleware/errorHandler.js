const errorHandler = (err, req, res, next) => {
  res.json({
    success: false,
    message: err.message || "Internal Server Error",
    status: err.status || 500,
  });
};

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const ErrorHandler = (res, message, status) =>
  res.json({
    success: false,
    message: message || "Internal Server Error",
    status: status || 500,
  });

export { errorHandler, AppError, ErrorHandler };
