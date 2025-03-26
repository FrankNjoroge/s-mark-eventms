const express = require("express");
const {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getUserNotifications,
} = require("../controllers/notificationController");

const {
  authenticateToken,
  checkRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/unread-count", authenticateToken, getUnreadCount);

// CRUD operations for admins
router
  .route("/")
  .get(authenticateToken, checkRole(["admin", "attendee"]), getNotifications)
  .post(authenticateToken, checkRole(["admin"]), createNotification);

router
  .route("/:id")
  .get(authenticateToken, getNotificationById)
  .put(authenticateToken, checkRole(["admin"]), updateNotification)
  .delete(authenticateToken, checkRole(["admin"]), deleteNotification);

router.put("/:id/read", authenticateToken, markAsRead);
router.put("/read-all", authenticateToken, markAllAsRead);

router.get("/user", authenticateToken, getUserNotifications); // ✅ User-specific route

module.exports = router;
