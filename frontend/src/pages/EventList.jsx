"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eventService } from "../services/api";
import { Calendar, MapPin, Clock, Search } from "lucide-react";
import { format } from "date-fns";

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const response = await eventService.getEvents();
        const data = response.data || response;
        const eventsArray = data.events || [];

        // Ensure we have valid data
        if (Array.isArray(eventsArray)) {
          setEvents(eventsArray);
        } else {
          console.error("Received non-array data for events:", data);
          setEvents([]);
          setError("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(
          "Failed to load events: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId) => {
    if (eventId) {
      console.log("Navigating to event details:", eventId);
      navigate(`/events/${eventId}`);
    } else {
      console.error("Invalid event ID:", eventId);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-gray-800">Upcoming Events</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No events found. Try a different search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            // Ensure event has a valid ID
            if (!event._id) {
              console.warn("Event without ID:", event);
              return null;
            }

            // Safe access to event properties with fallbacks
            const eventTicketPrice =
              event.ticketPrice !== undefined
                ? event.ticketPrice
                : event.price || 0;
            const eventCategory = event.category || "Uncategorized";
            const eventAttendees = Array.isArray(event.attendees)
              ? event.attendees
              : [];
            const eventCapacity = event.capacity || 0;

            return (
              <div
                key={event._id}
                onClick={() => handleEventClick(event._id)}
                className="cursor-pointer block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gray-200 relative">
                  {event.image && event.image.startsWith("http") ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "/placeholder.svg")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100">
                      <Calendar className="h-16 w-16 text-indigo-400" />
                    </div>
                  )}

                  <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 m-2 rounded-md text-sm font-medium">
                    {eventCategory}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      {event.time && /^\d{2}:\d{2}$/.test(event.time)
                        ? format(new Date(`1970-01-01T${event.time}`), "h:mm a")
                        : "Invalid Time"}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location || "Location not available"}</span>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 font-medium">
                      {eventTicketPrice > 0
                        ? `Ksh ${eventTicketPrice.toFixed(2)}`
                        : "Free"}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {eventCapacity - eventAttendees.length} spots left
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventList;
