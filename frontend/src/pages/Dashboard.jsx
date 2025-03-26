"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Calendar, Users, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("myEvents");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const response = await eventService.getEvents();

        console.log("Dashboard API response:", response);

        // Handle different response formats
        let eventsArray = [];

        if (Array.isArray(response)) {
          eventsArray = response;
        } else if (response && typeof response === "object") {
          if (response.events && Array.isArray(response.events)) {
            eventsArray = response.events;
          } else if (response.data && Array.isArray(response.data)) {
            eventsArray = response.data;
          } else {
            // Try to extract events from the object
            const possibleEvents = Object.values(response).filter(
              (item) =>
                item &&
                typeof item === "object" &&
                (item.title || item._id || item.id)
            );
            if (possibleEvents.length > 0) {
              eventsArray = possibleEvents;
            }
          }
        }
        // Fetch registered events

        const registeredResponse = await eventService.getRegisteredEvents();
        let registeredArray = Array.isArray(registeredResponse)
          ? registeredResponse
          : [];

        if (user) {
          const userId = user._id || user.id;

          // Filter events created by the user
          const created = eventsArray.filter(
            (event) =>
              (event.creator?._id || event.creator?.id || event.creatorId) ===
              userId
          );

          setMyEvents(created);
          setRegisteredEvents(registeredArray);
        }
      } catch (err) {
        console.error("Error fetching events for dashboard:", err);
        setError("Failed to load events: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

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
    if (
      !window.confirm(
        "Are you sure you want to cancel your registration for this event?"
      )
    ) {
      return;
    }
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
        <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
        <Link
          to="/events/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create New Event
        </Link>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("myEvents")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "myEvents"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Events
          </button>
          <button
            onClick={() => setActiveTab("registeredEvents")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "registeredEvents"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Registered Events
          </button>
        </nav>
      </div>

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
                {registeredEvents
                  .filter((event) => event && event._id)
                  .map((event) => (
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
                              onClick={() =>
                                handleCancelRegistration(event._id)
                              }
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
    </div>
  );
};

export default Dashboard;
