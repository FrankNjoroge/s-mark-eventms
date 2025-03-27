"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventService } from "../services/api";
import { useAuth } from "../context/useAuth";
import {
  Calendar,
  Users,
  Edit,
  Trash2,
  CreditCard,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import NotificationList from "../components/NotificationList";

const Dashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("myEvents");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const data = await eventService.getEvents();
        const events = data.events;

        //fetch registered events
        const registeredResponse = await eventService.getRegisteredEvents();
        let registeredArray = Array.isArray(registeredResponse)
          ? registeredResponse
          : [];

        if (user) {
          const created = events.filter(
            (event) => event.organizer === user._id
          );

          setMyEvents(created);
          setRegisteredEvents(registeredArray);
        }
      } catch (err) {
        setError("Failed to load events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  useEffect(() => {
    if (user && activeTab === "payments") {
      fetchPaymentHistory();
    }
  }, [user, activeTab]);

  const fetchPaymentHistory = async () => {
    try {
      setLoadingPayments(true);

      // In a real app, you would fetch from your API
      // const data = await paymentService.getPaymentHistory()

      // For demo purposes, we'll use mock data
      const mockPayments = [
        {
          id: "PAY-123456789",
          eventId: "1",
          eventTitle: "Annual Tech Conference",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          amount: 99.99,
          status: "completed",
          paymentMethod: {
            type: "credit_card",
            cardBrand: "Visa",
            lastFourDigits: "4242",
          },
        },
        {
          id: "PAY-987654321",
          eventId: "2",
          eventTitle: "Web Development Workshop",
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          amount: 49.99,
          status: "completed",
          paymentMethod: {
            type: "credit_card",
            cardBrand: "Mastercard",
            lastFourDigits: "5555",
          },
        },
        {
          id: "PAY-456789123",
          eventId: "3",
          eventTitle: "Networking Mixer",
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          amount: 19.99,
          status: "completed",
          paymentMethod: {
            type: "paypal",
            email: "user@example.com",
          },
        },
      ];

      setPaymentHistory(mockPayments);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        await eventService.deleteEvent(id);
        setMyEvents(myEvents.filter((event) => event._id !== id));
        toast.success("Event deleted successfully");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to delete the event"
        );
      }
    }
  };

  const handleCancelRegistration = async (id) => {
    try {
      await eventService.cancelRegistration(id);
      setRegisteredEvents(registeredEvents.filter((event) => event._id !== id));
      toast.success("Registration canceled successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to cancel registration"
      );
    }
  };

  const handleDownloadReceipt = (paymentId) => {
    // In a real app, you would generate and download a PDF receipt
    toast.success(`Downloading receipt for payment ${paymentId}...`);
    // Simulate download
    setTimeout(() => {
      toast.success("Receipt downloaded successfully");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mt-4 ml-2">
          My Dashboard
        </h1>
        {user.role === "admin" && (
          <Link
            to="/events/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create New Event
          </Link>
        )}
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {user.role === "attendee" && (
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Notifications
            </button>
          )}
          {user.role === "admin" && (
            <button
              onClick={() => setActiveTab("myEvents")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "myEvents"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Events
            </button>
          )}
          <button
            onClick={() => setActiveTab("registeredEvents")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "registeredEvents"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Registered Events
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "payments"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Payment History
          </button>
        </nav>
      </div>
      {activeTab === "dashboard" && (
        <>
          {/* Notifications Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Notifications
            </h2>
            <NotificationList />
          </div>

          {/* Upcoming Events Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Your Upcoming Events
            </h2>
            {registeredEvents.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">
                  You haven't registered for any events yet.
                </p>
                <Link
                  to="/events"
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {registeredEvents.slice(0, 3).map((event) => (
                    <li key={event._id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/events/${event._id}`}
                            className="text-indigo-600 hover:text-indigo-900 font-medium truncate"
                          >
                            {event.title}
                          </Link>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Registered
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {format(new Date(event.date), "MMMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {registeredEvents.length > 3 && (
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={() => setActiveTab("registeredEvents")}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View all registered events
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "myEvents" && (
        <>
          {myEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No events created
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new event.
              </p>
              <div className="mt-6">
                <Link
                  to="/events/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Event
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {myEvents.map((event) => (
                  <li key={event._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/events/${event._id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium truncate"
                        >
                          {event.title}
                        </Link>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              new Date(event.date) < new Date()
                                ? "bg-gray-100 text-gray-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {new Date(event.date) < new Date()
                              ? "Past"
                              : "Upcoming"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {format(new Date(event.date), "MMMM d, yyyy")}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {event.attendees.length} / {event.capacity}{" "}
                            attendees
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Link
                            to={`/events/${event._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {activeTab === "registeredEvents" && (
        <>
          {registeredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No registered events
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Browse events and register for ones you're interested in.
              </p>
              <div className="mt-6">
                <Link
                  to="/events"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {registeredEvents.map((event) => (
                  <li key={event._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/events/${event._id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium truncate"
                        >
                          {event.title}
                        </Link>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              new Date(event.date) < new Date()
                                ? "bg-gray-100 text-gray-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {new Date(event.date) < new Date()
                              ? "Past"
                              : "Upcoming"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {format(new Date(event.date), "MMMM d, yyyy")}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {event.attendees.length} / {event.capacity}{" "}
                            attendees
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <button
                            onClick={() => handleCancelRegistration(event._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel Registration
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {activeTab === "payments" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Payment History
            </h2>
          </div>

          {loadingPayments ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : paymentHistory.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Receipt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No payment history
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your payment history will appear here after you register for
                events.
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Payment Method
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.eventTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {format(new Date(payment.date), "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {payment.paymentMethod.type === "credit_card"
                            ? `${payment.paymentMethod.cardBrand} •••• ${payment.paymentMethod.lastFourDigits}`
                            : "PayPal"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDownloadReceipt(payment.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Download Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
