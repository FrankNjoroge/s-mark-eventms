const express = require("express");

const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userController");

//  @route   GET /api/profile
//  @desc    Get user profile
//  @access  Private
router.get("/", authenticateToken, getProfile);

//@route   PUT /api/profile
//  @desc    Update user profile
//   @access  Private
router.put("/", authenticateToken, updateProfile);

module.exports = router;
