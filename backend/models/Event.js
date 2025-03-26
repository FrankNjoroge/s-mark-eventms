const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      default: "09:00",
      required: true,
    },
    location: {
      type: String,
      default: "Not specified",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    capacity: {
      type: Number,
      default: 100,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: "Conference",
      required: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "draft",
    },
    image: {
      type: String,
    },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    tags: [String],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
