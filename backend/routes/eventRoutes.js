const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getUserEvents,
  getUserBookings,
} = require("../controllers/eventController");

const { cancelRegistration } = require("../controllers/bookingController");

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

router.get("/", getEvents);
// Route to get events the user has registered for
router.get("/my-registrations", authenticateToken, getUserBookings);
router.get("/:id", getEventById);
// route for admns to update events
router.put("/:id", updateEvent);
// route for admns to delete events
router.delete("/:id", deleteEvent);
//route for users to cancel registrations
router.delete(
  "/my-registrations/:eventId",
  authenticateToken,
  cancelRegistration
);
// Route for users to register for events
router.post("/:id/register", authenticateToken, registerForEvent);
// Route to get events created by user
router.get("/my-events", authenticateToken, getUserEvents);

module.exports = router;
