const Comment = require("../models/Comment");
const Lesson = require("../models/Lesson");

const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    const lesson = await Lesson.findById(
      req.params.lessonId
    );

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const comment = await Comment.create({
      user: req.user.userId,
      lesson: lesson._id,
      content: content.trim(),
    });

    const populatedComment = await comment.populate(
      "user",
      "name email"
    );

    res.status(201).json({
      message: "Comment created successfully",
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

const getLessonComments = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(
      req.params.lessonId
    );

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const comments = await Comment.find({
      lesson: req.params.lessonId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(
      req.params.id
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comment.user.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only edit your own comment",
      });
    }

    comment.content = req.body.content.trim();

    await comment.save();

    res.json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(
      req.params.id
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comment.user.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only delete your own comment",
      });
    }

    await comment.deleteOne();

    res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getLessonComments,
  updateComment,
  deleteComment,
};