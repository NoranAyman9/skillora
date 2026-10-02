const express = require("express");

const {
  enrollInCourse,
  getMyCourses,
} = require("../controllers/enrollmentController");

const authMiddleware = require("../middlewares/authMiddleware");

const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     description: Enroll the authenticated student in a course.
 *     tags:
 *       - Enrollments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to enroll in
 *     responses:
 *       201:
 *         description: Successfully enrolled in the course
 *       400:
 *         description: Student is already enrolled or invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Student role required.
 *       404:
 *         description: Course not found
 */
router.post(
  "/courses/:courseId/enroll",
  authMiddleware,
  roleMiddleware("student"),
  enrollInCourse
);

/**
 * @swagger
 * /api/enrollments/my-courses:
 *   get:
 *     summary: Get my enrolled courses
 *     description: Get all courses in which the authenticated student is enrolled.
 *     tags:
 *       - Enrollments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrolled courses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Student role required.
 */
router.get(
  "/enrollments/my-courses",
  authMiddleware,
  roleMiddleware("student"),
  getMyCourses
);

module.exports = router;