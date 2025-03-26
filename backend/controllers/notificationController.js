const Notification = require("../models/Notification");

// @desc Get all notifications
// @route GET /api/notifications
// @access Private (Admin)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// @desc Get a single notification
// @route GET /api/notifications/:id
// @access Private (Admin)
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notification", error });
  }
};

// @desc Create a new notification
// @route POST /api/notifications
// @access Private (Admin)
const createNotification = async (req, res) => {
  try {
    const { title, message, recipientType, eventId, status } = req.body;

    const notification = await Notification.create({
      title,
      message,
      recipientType,
      eventId: eventId || null,
      status,
      sentAt: status === "sent" ? new Date() : null,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};

// @desc Update a notification
// @route PUT /api/notifications/:id
// @access Private (Admin)
const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    Object.assign(notification, req.body);
    if (req.body.status === "sent") notification.sentAt = new Date();

    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

// @desc Delete a notification
// @route DELETE /api/notifications/:id
// @access Private (Admin)
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    await notification.deleteOne();
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
};

// @desc Mark a notification as read
// @route PUT /api/notifications/:id/read
// @access Private (Users)
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    if (!notification.readBy.includes(req.user._id)) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notification as read", error });
  }
};

// @desc Mark all notifications as read
// @route PUT /api/notifications/read-all
// @access Private (Users)
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({}, { $addToSet: { readBy: req.user._id } });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notifications as read", error });
  }
};
// @desc Get unread notifications count for the logged-in user
// @route GET /api/notifications/unread-count
// @access Private (Authenticated Users)
const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipientType: { $in: ["all", req.user.role] }, // Check notifications for the user's role
      readBy: { $ne: req.user._id }, // User has NOT read these notifications
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread count", error });
  }
};
const getUserNotifications = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.id; // Ensure user is authenticated
    const notifications = await Notification.find({
      $or: [{ recipientType: "all" }, { readBy: { $ne: userId } }],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getUserNotifications,
};
