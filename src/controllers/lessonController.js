const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const Comment = require("../models/Comment");
const Progress = require("../models/Progress");

const isValidVideoUrl = (value) => {
  if (!value) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
};

const createLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const {
      title,
      content,
      videoUrl,
      order,
    } = req.body;

    if (!isValidVideoUrl(videoUrl)) {
      return res.status(400).json({
        message: "videoUrl must be a valid HTTP or HTTPS URL",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (
      course.instructor.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only add lessons to your courses",
      });
    }

    const lesson = await Lesson.create({
      title,
      content,
      videoUrl,
      order,
      course: courseId,
    });

    res.status(201).json({
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseLessons = async (req, res, next) => {
  try {
    const course = await Course.findById(
      req.params.courseId
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const lessons = await Lesson.find({
      course: req.params.courseId,
    }).sort({ order: 1 });

    res.json(lessons);
  } catch (error) {
    next(error);
  }
};

const getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(
      req.params.id
    ).populate("course", "title");

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    res.json(lesson);
  } catch (error) {
    next(error);
  }
};

const updateLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(
      req.params.id
    );

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const course = await Course.findById(
      lesson.course
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (
      course.instructor.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only update your own lessons",
      });
    }

    const {
      title,
      content,
      videoUrl,
      order,
    } = req.body;

    if (
      videoUrl !== undefined &&
      !isValidVideoUrl(videoUrl)
    ) {
      return res.status(400).json({
        message: "videoUrl must be a valid HTTP or HTTPS URL",
      });
    }

    // Only allow these fields to be updated.
    if (title !== undefined) {
      lesson.title = title;
    }

    if (content !== undefined) {
      lesson.content = content;
    }

    if (videoUrl !== undefined) {
      lesson.videoUrl = videoUrl;
    }

    if (order !== undefined) {
      lesson.order = order;
    }

    await lesson.save();

    res.json({
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(
      req.params.id
    );

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    const course = await Course.findById(
      lesson.course
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (
      course.instructor.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only delete your own lessons",
      });
    }

    // Remove data related to the lesson
    await Comment.deleteMany({
      lesson: lesson._id,
    });

    await Progress.deleteMany({
      lesson: lesson._id,
    });

    await lesson.deleteOne();

    res.json({
      message: "Lesson and related data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLesson,
  getCourseLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};