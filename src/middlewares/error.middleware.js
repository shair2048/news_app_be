const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
      error = {
        status: 404,
        message: `Resource not found. Invalid: ${err.path}`,
      };
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = {
        status: 400,
        message: message.join(", "),
      };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      error = {
        status: 400,
        message: `Duplicate field value entered: ${Object.keys(
          err.keyValue
        ).join(", ")}`,
      };
    }

    res.status(error.status || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
