"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { eventService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    numberOfTickets: 1,
    attendeeNames: [""],
    paymentMethod: "credit_card",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);

        // Check if id is undefined or invalid
        if (!id) {
          console.error("Event ID is undefined or invalid:", id);
          setError(
            "Invalid event ID. Please try again or go back to the events list."
          );
          setLoading(false);
          return;
        }

        const data = await eventService.getEvent(id);
        if (!data) {
          setError("Event not found");
        } else {
          setEvent(data);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(
          "Failed to load event details. " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, location]);

  // Check if id is valid before proceeding
  if (!id) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">
          {" "}
          Invalid event ID. Please return to the events list.
        </span>
        <div className="mt-4">
          <button
            onClick={() => navigate("/events")}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isCreator =
    user?._id && event?.creator?._id ? user._id === event.creator._id : false;

  const isRegistered =
    user?._id &&
    (event?.attendees ?? []).some((attendee) => attendee._id === user._id);
  const isFullyBooked =
    (event?.attendees ?? []).length >= (event?.capacity ?? 0);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Show booking modal for enhanced booking experience
    setShowBookingModal(true);
  };

  const handleCancelRegistration = async () => {
    try {
      setIsRegistering(true);
      await eventService.cancelRegistration(id);

      // Update the event data
      const updatedEvent = await eventService.getEvent(id);
      setEvent(updatedEvent);

      toast.success("Successfully canceled registration");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to cancel registration"
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        setIsDeleting(true);
        await eventService.deleteEvent(id);
        toast.success("Event deleted successfully");
        navigate("/events");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to delete the event"
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAttendeesChange = (index, value) => {
    const newAttendeeNames = [...bookingData.attendeeNames];
    newAttendeeNames[index] = value;
    setBookingData((prev) => ({
      ...prev,
      attendeeNames: newAttendeeNames,
    }));
  };

  const handleTicketNumberChange = (e) => {
    const numTickets = Number.parseInt(e.target.value);
    let attendeeNames = [...bookingData.attendeeNames];

    // Adjust the attendee names array based on the number of tickets
    if (numTickets > attendeeNames.length) {
      // Add empty names if increasing tickets
      const diff = numTickets - attendeeNames.length;
      for (let i = 0; i < diff; i++) {
        attendeeNames.push("");
      }
    } else if (numTickets < attendeeNames.length) {
      // Remove names if decreasing tickets
      attendeeNames = attendeeNames.slice(0, numTickets);
    }

    setBookingData((prev) => ({
      ...prev,
      numberOfTickets: numTickets,
      attendeeNames,
    }));
  };

  // const handleBookingSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setIsRegistering(true);

  //     // In a real app, you would send the booking data to the backend
  //     await eventService.registerForEvent(id, {
  //       numberOfTickets: bookingData.numberOfTickets,
  //       attendeeNames: bookingData.attendeeNames,
  //       paymentMethod: bookingData.paymentMethod,
  //     });

  //     // Update the event data
  //     const updatedEvent = await eventService.getEvent(id);
  //     setEvent(updatedEvent);

  //     setShowBookingModal(false);
  //     toast.success("Successfully registered for the event!");

  //     // Reset booking data
  //     setBookingData({
  //       numberOfTickets: 1,
  //       attendeeNames: [""],
  //       paymentMethod: "credit_card",
  //     });
  //   } catch (err) {
  //     toast.error(
  //       err.response?.data?.message || "Failed to register for the event"
  //     );
  //   } finally {
  //     setIsRegistering(false);
  //   }
  // };
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsRegistering(true);

      console.log("Submitting booking data:", bookingData);

      const response = await eventService.registerForEvent(id, {
        numberOfTickets: bookingData.numberOfTickets,
        attendeeNames: bookingData.attendeeNames,
        paymentMethod: bookingData.paymentMethod,
      });

      console.log("Booking successful:", response);

      // Update the event data
      const updatedEvent = await eventService.getEvent(id);
      setEvent(updatedEvent);

      setShowBookingModal(false);
      toast.success("Successfully registered for the event!");

      // Reset booking data
      setBookingData({
        numberOfTickets: 1,
        attendeeNames: [""],
        paymentMethod: "credit_card",
      });
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.message || "Failed to register for the event"
      );
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || "Event not found"}</span>
        <div className="mt-4">
          <button
            onClick={() => navigate("/events")}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  // Safe access to event properties with fallbacks
  const eventTicketPrice =
    event.ticketPrice !== undefined ? event.ticketPrice : event.price || 0;
  const eventCategory = event.category || "Uncategorized";
  const eventAttendees = Array.isArray(event.attendees) ? event.attendees : [];
  const eventCapacity = event.capacity || 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-64 bg-gray-200 relative">
        {event.image ? (
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-100">
            <Calendar className="h-24 w-24 text-indigo-400" />
          </div>
        )}
        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 m-4 rounded-md text-sm font-medium">
          {eventCategory}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {event.title}
          </h1>

          {(isCreator || isAdmin()) && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/events/${id}/edit`)}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
            <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-2 text-indigo-500" />
            <span>
              {event.time > 12 ? `${event.time}PM` : `${event.time}AM`}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2 text-indigo-500" />
            <span>
              {eventAttendees.length} / {eventCapacity} attendees
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            About this event
          </h2>
          <p className="text-gray-600 whitespace-pre-line">
            {event.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="block text-gray-500 text-sm">Price</span>
            <span className="text-2xl font-bold text-indigo-600">
              {eventTicketPrice > 0
                ? `Ksh ${eventTicketPrice.toFixed(2)}`
                : "Free"}
            </span>
          </div>

          {user ? (
            isCreator ? (
              <span className="mt-4 sm:mt-0 text-gray-500 italic">
                You are the organizer of this event
              </span>
            ) : isRegistered ? (
              <button
                onClick={handleCancelRegistration}
                disabled={isRegistering}
                className="mt-4 sm:mt-0 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isRegistering ? "Processing..." : "Cancel Registration"}
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={isRegistering || isFullyBooked}
                className="mt-4 sm:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isRegistering
                  ? "Processing..."
                  : isFullyBooked
                  ? "Fully Booked"
                  : "Register Now"}
              </button>
            )
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="mt-4 sm:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login to Register
            </button>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Book Event Tickets
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="numberOfTickets"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of Tickets
                  </label>
                  <select
                    id="numberOfTickets"
                    name="numberOfTickets"
                    value={bookingData.numberOfTickets}
                    onChange={handleTicketNumberChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {[
                      ...Array(
                        Math.min(10, eventCapacity - eventAttendees.length)
                      ).keys(),
                    ].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "ticket" : "tickets"} (Ksh
                        {((i + 1) * eventTicketPrice).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendee Information
                  </label>
                  {bookingData.attendeeNames.map((name, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`attendee-${index}`}
                        className="block text-xs text-gray-500"
                      >
                        Attendee {index + 1}
                      </label>
                      <input
                        id={`attendee-${index}`}
                        type="text"
                        value={name}
                        onChange={(e) =>
                          handleAttendeesChange(index, e.target.value)
                        }
                        placeholder="Full Name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={bookingData.paymentMethod}
                    onChange={handleBookingChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      Ksh
                      {(eventTicketPrice * bookingData.numberOfTickets).toFixed(
                        2
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">
                      Ksh
                      {(
                        eventTicketPrice *
                        bookingData.numberOfTickets *
                        0.05
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      Ksh
                      {(
                        eventTicketPrice *
                        bookingData.numberOfTickets *
                        1.05
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isRegistering ? "Processing..." : "Complete Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
