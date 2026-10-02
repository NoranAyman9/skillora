const express = require("express");

const {
  createComment,
  getLessonComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const authMiddleware = require("../middlewares/authMiddleware");

const validateComment = require("../validators/commentValidator");

const router = express.Router();

/**
 * @swagger
 * /api/lessons/{lessonId}/comments:
 *   post:
 *     summary: Create a comment
 *     description: Add a new comment to a lesson. The user must be authenticated.
 *     tags:
 *       - Comments
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: This lesson was very helpful.
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Lesson not found
 */
router.post(
  "/lessons/:lessonId/comments",
  authMiddleware,
  validateComment,
  createComment
);

/**
 * @swagger
 * /api/lessons/{lessonId}/comments:
 *   get:
 *     summary: Get lesson comments
 *     description: Get all comments associated with a specific lesson.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lesson
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       404:
 *         description: Lesson not found
 */
router.get(
  "/lessons/:lessonId/comments",
  getLessonComments
);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     description: Update an existing comment. The user must be authenticated.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: I updated my comment.
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.put(
  "/comments/:id",
  authMiddleware,
  validateComment,
  updateComment
);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete an existing comment. The user must be authenticated.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.delete(
  "/comments/:id",
  authMiddleware,
  deleteComment
);

module.exports = router;