const Booking = require("../models/Booking");
const Event = require("../models/Event");
const qrcode = require("qrcode");

const createBooking = async (req, res) => {
  try {
    const { eventId, tickets = 1 } = req.body;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check event capacity
    const existingBookings = await Booking.countDocuments({
      event: eventId,
      status: { $ne: "cancelled" },
    });

    if (existingBookings + tickets > event.capacity) {
      return res.status(400).json({ message: "Event is sold out" });
    }

    // Calculate total price
    const totalPrice = event.ticketPrice * tickets;

    // Generate QR Code
    const qrCodeData = JSON.stringify({
      eventId,
      userId: req.user._id,
      bookingDate: new Date(),
    });
    const qrCodeImage = await qrcode.toDataURL(qrCodeData);

    // Create booking
    const booking = new Booking({
      event: eventId,
      user: req.user._id,
      tickets,
      totalPrice,
      qrCode: qrCodeImage,
      status: "confirmed",
    });

    await booking.save();

    res.status(201).json({
      message: "Booking successful",
      booking,
      qrCode: qrCodeImage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message,
    });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.eventId;

    // Find and delete the user's booking for the event
    const booking = await Booking.findOneAndDelete({
      user: userId,
      eventID: eventId,
    });

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Registration not found or already cancelled" });
    }

    // Optionally, update the event's attendee count
    await Event.findByIdAndUpdate(eventId, { $pull: { attendees: userId } });

    res.status(200).json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    res.status(500).json({ message: "Failed to cancel registration" });
  }
};

module.exports = {
  createBooking,
  cancelRegistration,
};
