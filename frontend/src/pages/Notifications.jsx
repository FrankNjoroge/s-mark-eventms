"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Send, Save, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { notificationService, eventService } from "../services/api";
import { useAuth } from "../context/useAuth";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [events, setEvents] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchNotifications();
    if (isAdmin()) {
      fetchEvents();
    }
  }, [isAdmin]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load notifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  const handleSubmit = async (notificationData, sendImmediately = false) => {
    try {
      if (currentNotification) {
        // Update existing notification
        await notificationService.updateNotification(currentNotification._id, {
          ...notificationData,
          status: sendImmediately ? "sent" : notificationData.status,
        });
        toast.success(
          sendImmediately
            ? "Notification updated and sent"
            : "Notification updated"
        );
      } else {
        // Create new notification
        await notificationService.createNotification({
          ...notificationData,
          status: sendImmediately ? "sent" : "draft",
        });
        toast.success(
          sendImmediately
            ? "Notification created and sent"
            : "Notification created"
        );
      }
      fetchNotifications();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await notificationService.deleteNotification(id);
        toast.success("Notification deleted");
        setNotifications(
          notifications.filter((notification) => notification._id !== id)
        );
      } catch (err) {
        console.log(err);
        toast.error("Failed to delete notification");
      }
    }
  };

  const handleSend = async (notification) => {
    if (
      window.confirm(
        `Are you sure you want to send this notification to all ${notification.recipientType}?`
      )
    ) {
      try {
        await notificationService.sendNotification(notification._id);
        toast.success("Notification sent successfully");
        fetchNotifications();
      } catch (err) {
        console.log(err);
        toast.error("Failed to send notification");
      }
    }
  };

  const openModal = (notification = null) => {
    setCurrentNotification(notification);
    setShowModal(true);
  };

  const filteredNotifications = notifications.filter((notification) => {
    // Apply search filter
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply status filter
    const matchesStatus =
      filterStatus === "all" || notification.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // If not admin, redirect or show unauthorized message
  if (!isAdmin()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p className="font-bold">Unauthorized</p>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notification Management</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 inline mr-1" /> Create Notification
        </button>
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
              <option value="all">All Status</option>
              <option value="draft">Drafts</option>
              <option value="sent">Sent</option>
            </select>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No notifications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <tr key={notification._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {notification.message}
                      </div>
                      {notification.eventId && (
                        <div className="text-xs text-indigo-600 mt-1">
                          Event:{" "}
                          {events.find((e) => e._id === notification.eventId)
                            ?.title || "Unknown Event"}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {notification.recipientType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          notification.status === "sent"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {notification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notification.status === "sent"
                        ? format(
                            new Date(
                              notification.sentAt || notification.updatedAt
                            ),
                            "MMM d, yyyy h:mm a"
                          )
                        : format(
                            new Date(notification.createdAt),
                            "MMM d, yyyy h:mm a"
                          )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {notification.status === "draft" && (
                        <>
                          <button
                            onClick={() => handleSend(notification)}
                            className="text-green-600 hover:text-green-900 mr-3"
                            title="Send notification"
                          >
                            <Send className="h-5 w-5 inline" />
                          </button>
                          <button
                            onClick={() => openModal(notification)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Edit notification"
                          >
                            <Edit className="h-5 w-5 inline" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete notification"
                      >
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentNotification
                  ? "Edit Notification"
                  : "Create Notification"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>

            <NotificationForm
              notification={currentNotification}
              onSubmit={handleSubmit}
              onCancel={() => setShowModal(false)}
              events={events}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Notification Form Component
const NotificationForm = ({
  notification,
  onSubmit,
  onCancel,
  events = [],
}) => {
  const [formData, setFormData] = useState({
    title: notification?.title || "",
    message: notification?.message || "",
    recipientType: notification?.recipientType || "all",
    eventId: notification?.eventId || "",
    status: notification?.status || "draft",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, sendImmediately = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData, sendImmediately);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show event selection only for attendee notifications
  const showEventSelection = formData.recipientType === "attendees";

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          value={formData.message}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="recipientType"
          className="block text-sm font-medium text-gray-700"
        >
          Recipients *
        </label>
        <select
          id="recipientType"
          name="recipientType"
          required
          value={formData.recipientType}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        >
          <option value="all">All Users</option>
          <option value="attendees">Event Attendees</option>
          <option value="vendors">Vendors</option>
        </select>
      </div>

      {showEventSelection && (
        <div>
          <label
            htmlFor="eventId"
            className="block text-sm font-medium text-gray-700"
          >
            Event (optional - if selected, only attendees of this event will
            receive the notification)
          </label>
          <select
            id="eventId"
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center"
        >
          <Save className="h-4 w-4 mr-1" />
          {isSubmitting ? "Saving..." : "Save as Draft"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={(e) => handleSubmit(e, true)}
          className="px-4 py-2 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center"
        >
          <Send className="h-4 w-4 mr-1" />
          {isSubmitting ? "Sending..." : "Send Now"}
        </button>
      </div>
    </form>
  );
};

export default Notifications;
