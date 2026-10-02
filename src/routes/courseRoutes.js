const express = require("express");

const {
  createCourse,
  getCourses,
  getCourseById,
  getCourseStatistics,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const authMiddleware = require("../middlewares/authMiddleware");

const roleMiddleware = require("../middlewares/roleMiddleware");

const validateMiddleware = require("../middlewares/validateMiddleware");

const courseValidator = require("../validators/courseValidator");

const router = express.Router();

/**
 * @swagger
 * /api/courses/statistics:
 *   get:
 *     summary: Get course statistics
 *     description: Get total courses, average price, minimum price, maximum price, and courses count by category.
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Instructor role required.
 */
router.get(
  "/statistics",
  authMiddleware,
  roleMiddleware("instructor"),
  getCourseStatistics
);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     description: Get a paginated list of available courses.
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of courses per page
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 */
router.get("/", getCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     description: Get detailed information about a specific course.
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       404:
 *         description: Course not found
 */
router.get("/:id", getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     description: Create a new course. Only authenticated instructors can create courses.
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete JavaScript Course
 *               description:
 *                 type: string
 *                 example: Learn JavaScript from beginner to advanced.
 *               price:
 *                 type: number
 *                 example: 500
 *               category:
 *                 type: string
 *                 example: Programming
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Instructor role required.
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("instructor"),
  courseValidator,
  validateMiddleware,
  createCourse
);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     description: Update an existing course. Only authenticated instructors can update courses.
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Advanced JavaScript Course
 *               description:
 *                 type: string
 *                 example: Updated course description.
 *               price:
 *                 type: number
 *                 example: 600
 *               category:
 *                 type: string
 *                 example: Programming
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Instructor role required.
 *       404:
 *         description: Course not found
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  updateCourse
);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Delete an existing course. Only authenticated instructors can delete courses.
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Instructor role required.
 *       404:
 *         description: Course not found
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  deleteCourse
);

module.exports = router;