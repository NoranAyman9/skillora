const express = require("express");

const {
  createLesson,
  getCourseLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const authMiddleware = require("../middlewares/authMiddleware");

const roleMiddleware = require("../middlewares/roleMiddleware");

const validateMiddleware = require("../middlewares/validateMiddleware");

const lessonValidator = require("../validators/lessonValidator");

const router = express.Router();

/**
 * @swagger
 * /api/courses/{courseId}/lessons:
 *   post:
 *     summary: Create a new lesson
 *     description: Create a new lesson inside a course. Only authenticated instructors can create lessons.
 *     tags:
 *       - Lessons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to JavaScript
 *               content:
 *                 type: string
 *                 example: JavaScript is a programming language used to build web applications.
 *               videoUrl:
 *                 type: string
 *                 example: https://example.com/video
 *               order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Instructor role required.
 *       404:
 *         description: Course not found
 */
router.post(
  "/courses/:courseId/lessons",
  authMiddleware,
  roleMiddleware("instructor"),
  lessonValidator,
  validateMiddleware,
  createLesson
);

/**
 * @swagger
 * /api/courses/{courseId}/lessons:
 *   get:
 *     summary: Get all lessons of a course
 *     description: Get all lessons belonging to a specific course.
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Lessons retrieved successfully
 *       404:
 *         description: Course not found
 */
router.get(
  "/courses/:courseId/lessons",
  getCourseLessons
);

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     description: Get details of a specific lesson.
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson retrieved successfully
 *       404:
 *         description: Lesson not found
 */
router.get(
  "/lessons/:id",
  getLessonById
);

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     description: Update an existing lesson. Only authenticated instructors can update lessons.
 *     tags:
 *       - Lessons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Advanced JavaScript
 *               content:
 *                 type: string
 *                 example: Updated lesson content.
 *               videoUrl:
 *                 type: string
 *                 example: https://example.com/updated-video
 *               order:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Instructor role required.
 *       404:
 *         description: Lesson not found
 */
router.put(
  "/lessons/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  updateLesson
);

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     description: Delete an existing lesson. Only authenticated instructors can delete lessons.
 *     tags:
 *       - Lessons
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Instructor role required.
 *       404:
 *         description: Lesson not found
 */
router.delete(
  "/lessons/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  deleteLesson
);

module.exports = router;