const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { body, validationResult } = require("express-validator");

// Validation middleware
const validateRegistration = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  register
);
router.post("/login", validateLogin, handleValidationErrors, login);

module.exports = router;
