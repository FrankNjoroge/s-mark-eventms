"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { notificationService } from "../services/api";
// import { useAuth } from "../context/useAuth";
import { Bell, Search, Filter, CheckCircle } from "lucide-react";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  //   const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getUserNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markNotificationAsRead(id);
      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllNotificationsAsRead();
      // Update local state
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    // Apply search filter
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply status filter
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "read" && notification.read) ||
      (filterStatus === "unread" && !notification.read);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Bell className="h-6 w-6 mr-2 text-indigo-600" />
          My Notifications
        </h1>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Notifications</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No notifications found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {format(
                      new Date(notification.sentAt || notification.createdAt),
                      "MMM d, yyyy h:mm a"
                    )}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{notification.message}</p>
                {!notification.read && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotifications;
