const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      capacity,
      ticketPrice,
      categories,
      tags,
    } = req.body;

    const event = new Event({
      title,
      description,
      date,
      location,
      organizer: req.user._id,
      capacity,
      ticketPrice,
      categories,
      tags,
      status: "draft",
    });

    await event.save();

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Event creation failed",
      error: error.message,
    });
  }
};

const listEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status = "published" } = req.query;

    const query = { status };
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
module.exports = {
  createEvent,
  listEvents,
};
