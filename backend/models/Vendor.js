const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    description: { type: String, trim: true },
    logo: { type: String, trim: true },
    category: {
      type: String,
      enum: [
        "Catering",
        "Venue",
        "Equipment",
        "Entertainment",
        "Decoration",
        "Photography",
        "Transportation",
        "Other",
      ],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
