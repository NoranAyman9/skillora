const express = require("express");

const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

const validateMiddleware = require("../middlewares/validateMiddleware");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new student or instructor account.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: header
 *         name: x-instructor-secret
 *         required: false
 *         schema:
 *           type: string
 *         description: Required when registering as an instructor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Noran Ayman
 *               email:
 *                 type: string
 *                 format: email
 *                 example: noran@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum:
 *                   - student
 *                   - instructor
 *                 example: student
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 *       403:
 *         description: Invalid instructor secret
 */
router.post(
  "/register",
  registerValidator,
  validateMiddleware,
  register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate a user and return a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: noran@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 */
router.post(
  "/login",
  loginValidator,
  validateMiddleware,
  login
);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Return the profile of the currently authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized - JWT token is missing or invalid
 */
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;