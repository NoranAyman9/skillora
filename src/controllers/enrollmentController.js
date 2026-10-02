const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: course._id,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        message: "Already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user.userId,
      course: course._id,
    });

    res.status(201).json({
      message: "Enrollment successful",
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.userId,
    }).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "name email",
      },
    });

    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollInCourse,
  getMyCourses,
};