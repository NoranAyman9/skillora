const validateComment = (req, res, next) => {
  const { content } = req.body;

  if (typeof content !== "string") {
    return res.status(400).json({
      message: "Comment content must be a string",
    });
  }

  if (!content.trim()) {
    return res.status(400).json({
      message: "Comment content is required",
    });
  }

  if (content.trim().length > 1000) {
    return res.status(400).json({
      message: "Comment cannot exceed 1000 characters",
    });
  }

  next();
};

module.exports = validateComment;