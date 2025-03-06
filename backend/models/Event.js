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
    location: {
      venue: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
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
    categories: [String],
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "draft",
    },
    coverImage: String,
    tags: [String],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
