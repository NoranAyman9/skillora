const express = require("express");

const {
  createOrUpdateRating,
  getCourseRatings,
  deleteRating,
} = require("../controllers/ratingController");

const authMiddleware = require("../middlewares/authMiddleware");

const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/courses/{courseId}/ratings:
 *   post:
 *     summary: Create or update a course rating
 *     description: Allow an authenticated student to create a rating or update their existing rating for a course.
 *     tags:
 *       - Ratings
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
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Invalid rating or request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Student role required.
 *       404:
 *         description: Course not found
 */
router.post(
  "/courses/:courseId/ratings",
  authMiddleware,
  roleMiddleware("student"),
  createOrUpdateRating
);

/**
 * @swagger
 * /api/courses/{courseId}/ratings:
 *   get:
 *     summary: Get course ratings
 *     description: Get all ratings and rating information for a specific course.
 *     tags:
 *       - Ratings
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Course ratings retrieved successfully
 *       404:
 *         description: Course not found
 */
router.get(
  "/courses/:courseId/ratings",
  getCourseRatings
);

/**
 * @swagger
 * /api/ratings/{id}:
 *   delete:
 *     summary: Delete a rating
 *     description: Delete an existing rating. Only the authenticated student can delete their rating.
 *     tags:
 *       - Ratings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the rating
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. Student role required.
 *       404:
 *         description: Rating not found
 */
router.delete(
  "/ratings/:id",
  authMiddleware,
  roleMiddleware("student"),
  deleteRating
);

module.exports = router;