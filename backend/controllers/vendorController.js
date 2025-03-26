const Vendor = require("../models/Vendor.js");

// @desc Get all vendors
// @route GET /api/vendors
// @access Public
const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res
      .status(500)
      .json({ message: "Error fetching vendors", error: error.message });
  }
};

// @desc Get a single vendor
// @route GET /api/vendors/:id
// @access Public
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res
      .status(500)
      .json({ message: "Error fetching vendor", error: error.message });
  }
};

// @desc Create a new vendor
// @route POST /api/vendors
// @access Private (Admin/Event Manager)
const createVendor = async (req, res) => {
  try {
    const { name, email, phone, website, description, logo, category } =
      req.body;

    if (!name || !email || !category) {
      return res
        .status(400)
        .json({ message: "Name, email, and category are required" });
    }

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res
        .status(400)
        .json({ message: "Vendor with this email already exists" });
    }

    const vendor = new Vendor({
      name,
      email,
      phone,
      website,
      description,
      logo,
      category,
    });

    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    console.error("Error creating vendor:", error);
    res
      .status(500)
      .json({ message: "Error creating vendor", error: error.message });
  }
};

// @desc Update a vendor
// @route PUT /api/vendors/:id
// @access Private (Admin/Event Manager)
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    Object.assign(vendor, req.body);
    await vendor.save();

    res.status(200).json(vendor);
  } catch (error) {
    console.error("Error updating vendor:", error);
    res
      .status(500)
      .json({ message: "Error updating vendor", error: error.message });
  }
};

// @desc Delete a vendor
// @route DELETE /api/vendors/:id
// @access Private (Admin/Event Manager)
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    await vendor.deleteOne();
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res
      .status(500)
      .json({ message: "Error deleting vendor", error: error.message });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
};
