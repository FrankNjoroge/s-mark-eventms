const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/bookingController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/", authenticateToken, createBooking);

module.exports = router;
