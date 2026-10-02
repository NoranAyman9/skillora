const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");

const updateLessonProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { completed, progressPercentage } = req.body;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: lesson.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You must be enrolled in this course",
      });
    }

    if (
      completed !== undefined &&
      typeof completed !== "boolean"
    ) {
      return res.status(400).json({
        message: "Completed must be a boolean",
      });
    }

    if (
      progressPercentage !== undefined &&
      (
        typeof progressPercentage !== "number" ||
        progressPercentage < 0 ||
        progressPercentage > 100
      )
    ) {
      return res.status(400).json({
        message: "Progress percentage must be between 0 and 100",
      });
    }

    let progress = await Progress.findOne({
      student: req.user.userId,
      lesson: lessonId,
    });

    if (!progress) {
      progress = new Progress({
        student: req.user.userId,
        course: lesson.course,
        lesson: lessonId,
      });
    }

    if (completed !== undefined) {
      progress.completed = completed;
    }

    if (progressPercentage !== undefined) {
      progress.progressPercentage = progressPercentage;
    }

    if (progress.completed) {
      progress.progressPercentage = 100;
    }

    await progress.save();

    res.json({
      message: "Lesson progress updated successfully",
      progress,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You must be enrolled in this course",
      });
    }

    const progress = await Progress.find({
      student: req.user.userId,
      course: courseId,
    })
      .populate("lesson", "title order")
      .sort({ createdAt: 1 });

    const totalLessons = await Lesson.countDocuments({
      course: courseId,
    });

    const completedLessons = progress.filter(
      (item) => item.completed
    ).length;

    const overallPercentage =
      totalLessons > 0
        ? Number(
            ((completedLessons / totalLessons) * 100).toFixed(1)
          )
        : 0;

    res.json({
      courseId,
      totalLessons,
      completedLessons,
      overallPercentage,
      lessons: progress,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateLessonProgress,
  getCourseProgress,
};