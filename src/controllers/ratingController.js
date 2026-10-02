const Rating = require("../models/Rating");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const createOrUpdateRating = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, review } = req.body;

    if (
      typeof rating !== "number" ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    if (
      review !== undefined &&
      (typeof review !== "string" || review.trim().length > 1000)
    ) {
      return res.status(400).json({
        message: "Review must be a string with maximum 1000 characters",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You must be enrolled in the course to rate it",
      });
    }

    const existingRating = await Rating.findOne({
      student: req.user.userId,
      course: courseId,
    });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review?.trim() || "";

      await existingRating.save();

      return res.json({
        message: "Rating updated successfully",
        rating: existingRating,
      });
    }

    const newRating = await Rating.create({
      student: req.user.userId,
      course: courseId,
      rating,
      review: review?.trim() || "",
    });

    res.status(201).json({
      message: "Rating created successfully",
      rating: newRating,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({
      course: req.params.courseId,
    })
      .populate("student", "name")
      .sort({ createdAt: -1 });

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, item) => sum + item.rating, 0) /
          ratings.length
        : 0;

    res.json({
      count: ratings.length,
      averageRating: Number(averageRating.toFixed(1)),
      ratings,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRating = async (req, res, next) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    if (rating.student.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own rating",
      });
    }

    await rating.deleteOne();

    res.json({
      message: "Rating deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateRating,
  getCourseRatings,
  deleteRating,
};