const express = require("express");
const {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorController.js");
const {
  authenticateToken,
  checkRole,
} = require("../middleware/authMiddleware.js");

const router = express.Router();

router
  .route("/")
  .get(getVendors)
  .post(authenticateToken, checkRole(["admin"]), createVendor);
router
  .route("/:id")
  .get(getVendorById)
  .put(authenticateToken, checkRole(["admin"]), updateVendor)
  .delete(
    authenticateToken,
    checkRole(["admin", "event-manager"]),
    deleteVendor
  );

module.exports = router;
