"use client";

import { useState, useEffect } from "react";
import { Bell, X, Check, Clock } from "lucide-react";
import { format } from "date-fns";
import { notificationService } from "../services/api";
import { useAuth } from "../context/useAuth";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserNotifications();
  }, [user]);

  const fetchUserNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  // Filter to show only unread by default, or all if showAll is true
  const displayedNotifications = showAll
    ? notifications
    : notifications.filter((notification) => !notification.read).slice(0, 5);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  if (loading) {
    return <div className="p-4 text-center">Loading notifications...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p>No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-medium">
          Notifications{" "}
          {unreadCount > 0 && (
            <span className="text-sm bg-red-500 text-white rounded-full px-2 py-0.5 ml-2">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <Check className="h-3 w-3 mr-1" /> Mark all as read
            </button>
          )}
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            {showAll ? "Show unread" : "Show all"}
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {displayedNotifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 border-b hover:bg-gray-50 ${
              !notification.read ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex justify-between">
              <h4 className="font-medium text-gray-900">
                {notification.title}
              </h4>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Mark as read"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {format(new Date(notification.sentAt), "MMM d, yyyy h:mm a")}
              {notification.eventId && (
                <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                  Event
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {notifications.length > 5 && !showAll && (
        <div className="p-3 text-center border-t">
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View all ({notifications.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
