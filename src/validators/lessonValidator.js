const { body } = require("express-validator");

const lessonValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required"),

  body("order")
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),
];

module.exports = lessonValidator;