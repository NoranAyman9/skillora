const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");
const Comment = require("../models/Comment");
const Rating = require("../models/Rating");
const Progress = require("../models/Progress");

const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, price } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      price,
      instructor: req.user.userId,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};

const getCourses = async (req, res, next) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 5;

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        message: "Page must be a positive integer",
      });
    }

    if (!Number.isInteger(limit) || limit < 1) {
      return res.status(400).json({
        message: "Limit must be a positive integer",
      });
    }

    // Prevent very large requests
    if (limit > 50) {
      limit = 50;
    }

    const skip = (page - 1) * limit;

    const { search, category } = req.query;

    const filter = {};

    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.title = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(filter);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      courses,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

const getCourseStatistics = async (req, res, next) => {
  try {
    const statistics = await Course.aggregate([
      {
        $group: {
          _id: null,
          totalCourses: {
            $sum: 1,
          },
          averagePrice: {
            $avg: "$price",
          },
          minimumPrice: {
            $min: "$price",
          },
          maximumPrice: {
            $max: "$price",
          },
        },
      },
    ]);

    const categories = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          courseCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          courseCount: -1,
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          courseCount: 1,
        },
      },
    ]);

    if (statistics.length === 0) {
      return res.json({
        totalCourses: 0,
        averagePrice: 0,
        minimumPrice: 0,
        maximumPrice: 0,
        categories: [],
      });
    }

    res.json({
      totalCourses: statistics[0].totalCourses,
      averagePrice: Number(
        statistics[0].averagePrice.toFixed(2)
      ),
      minimumPrice: statistics[0].minimumPrice,
      maximumPrice: statistics[0].maximumPrice,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

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
        message: "You can only update your own courses",
      });
    }

    const {
      title,
      description,
      category,
      price,
    } = req.body;

    course.title = title ?? course.title;
    course.description =
      description ?? course.description;
    course.category =
      category ?? course.category;
    course.price = price ?? course.price;

    await course.save();

    res.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

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
        message: "You can only delete your own courses",
      });
    }

    // Find lessons first because comments and progress
    // are connected to lessons.
    const lessons = await Lesson.find({
      course: course._id,
    }).select("_id");

    const lessonIds = lessons.map(
      (lesson) => lesson._id
    );

    // Delete comments belonging to course lessons
    if (lessonIds.length > 0) {
      await Comment.deleteMany({
        lesson: { $in: lessonIds },
      });

      // Delete lesson progress
      await Progress.deleteMany({
        lesson: { $in: lessonIds },
      });
    }

    // Delete lessons
    await Lesson.deleteMany({
      course: course._id,
    });

    // Delete enrollments
    await Enrollment.deleteMany({
      course: course._id,
    });

    // Delete ratings
    await Rating.deleteMany({
      course: course._id,
    });

    // Finally delete the course
    await course.deleteOne();

    res.json({
      message:
        "Course and related data deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  getCourseStatistics,
  updateCourse,
  deleteCourse,
};
