const handleError = (res, error) => {
  switch (error.name) {
    case "CastError":
      return res.status(400).json({
        status: "fail",
        message: "Invalid ID format",
      });
    case "ValidationError":
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    case "MongoServerError":
      if (error.code === 11000) {
        return res.status(400).json({
          status: "fail",
          message: "Duplicate field value",
        });
      }
      break;
  }
  return res.status(500).json({
    status: "error",
    message: `Internal server error. Please try again later. ${error.message}`,
  });
};

module.exports = handleError;
