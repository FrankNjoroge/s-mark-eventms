const express = require("express");
const router = express.Router();
const { createEvent, listEvents } = require("../controllers/eventController");
const {
  authenticateToken,
  checkRole,
} = require("../middleware/authMiddleware");

router.post(
  "/",
  authenticateToken,
  checkRole(["admin", "organizer"]),
  createEvent
);

router.get("/", authenticateToken, listEvents);

module.exports = router;
