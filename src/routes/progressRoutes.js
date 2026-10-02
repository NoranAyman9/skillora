const express = require("express");

const {
  updateLessonProgress,
  getCourseProgress,
} = require("../controllers/progressController");

const authMiddleware = require("../middlewares/authMiddleware");

const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/lessons/{lessonId}/progress:
 *   put:
 *     summary: Update lesson progress
 *     description: Update the authenticated student's progress for a specific lesson.
 *     tags:
 *       - Progress
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lesson
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - completed
 *             properties:
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Lesson progress updated successfully
 *       400:
 *         description: Invalid progress data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Student role required.
 *       404:
 *         description: Lesson not found
 */
router.put(
  "/lessons/:lessonId/progress",
  authMiddleware,
  roleMiddleware("student"),
  updateLessonProgress
);

/**
 * @swagger
 * /api/courses/{courseId}/progress:
 *   get:
 *     summary: Get course progress
 *     description: Get the authenticated student's progress in a specific course.
 *     tags:
 *       - Progress
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Course progress retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Student role required.
 *       404:
 *         description: Course not found
 */
router.get(
  "/courses/:courseId/progress",
  authMiddleware,
  roleMiddleware("student"),
  getCourseProgress
);

module.exports = router;