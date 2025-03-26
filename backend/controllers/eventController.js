const Event = require("../models/Event");
const Booking = require("../models/Booking");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      capacity,
      ticketPrice,
      time,
      category,
      image,
      tags,
    } = req.body;

    const fullDateTime =
      date && time ? new Date(`${date}T${time}:00.000Z`) : null;

    const event = new Event({
      title,
      description,
      date,
      location,
      organizer: req.user._id,
      capacity,
      ticketPrice,
      category,
      time: fullDateTime,
      image,
      tags,
      status: "draft",
    });

    await event.save();

    res.status(201).json({
      message: "Event created successfully",
      event: { ...event.toObject(), _id: event._id.toString() },
    });
  } catch (error) {
    res.status(500).json({
      message: "Event creation failed",
      error: error.message,
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const query = {};
    if (category) {
      query.categories = category;
    }

    const events = await Event.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: 1 });

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve events",
      error: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve event",
      error: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params; // Event ID
    const userId = req.user._id; // Get user ID from auth middleware
    const { numberOfTickets, paymentMethod, transactionId } = req.body;

    // Find event
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check ticket availability
    if (event.capacity - event.attendees.length < numberOfTickets) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // Calculate total price
    const totalPrice = numberOfTickets * event.ticketPrice;

    // Create new booking
    const booking = new Booking({
      eventID: id,
      user: userId,
      numberOfTickets,
      totalPrice,
      qrCode: `QR-${userId}-${Date.now()}`, // Unique QR code generation
      status: "pending",
      paymentDetails: {
        transactionId,
        method: paymentMethod,
      },
    });

    await booking.save();

    // Update event's attendee list
    event.attendees.push(userId);
    await event.save();

    res
      .status(201)
      .json({ message: "Successfully registered for the event!", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserEvents = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from auth middleware
    const events = await Event.find({ organizer: userId });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Fetching bookings for user ID:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user bookings
    const bookings = await Booking.find({ user: userId }).populate("eventID");

    console.log("Bookings found:", bookings);

    // Extract event details, filter out null eventIDs
    const registeredEvents = bookings
      .map((booking) => booking.eventID)
      .filter((event) => event !== null);

    res.status(200).json(registeredEvents); // Always return an array
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Failed to fetch registered events" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getUserEvents,
  getUserBookings,
};
