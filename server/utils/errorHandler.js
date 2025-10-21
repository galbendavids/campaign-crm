// Database error handling utility
const handleDatabaseError = (error, operation = "database operation") => {
  let errorMessage = `Failed to perform ${operation}`;

  if (error.message.includes("buffering timed out")) {
    errorMessage =
      "Database connection failed. Please ensure MongoDB is running and accessible.";
  } else if (error.message.includes("ECONNREFUSED")) {
    errorMessage = "Cannot connect to MongoDB. Please start MongoDB service.";
  } else if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyPattern)[0];
    errorMessage = `A record with this ${field} already exists.`;
  } else if (error.name === "ValidationError") {
    const validationErrors = Object.values(error.errors).map(
      (err) => err.message
    );
    errorMessage = validationErrors.join(", ");
  } else if (error.name === "CastError") {
    errorMessage = "Invalid ID format provided.";
  } else if (error.message) {
    errorMessage = error.message;
  }

  return errorMessage;
};

module.exports = { handleDatabaseError };
