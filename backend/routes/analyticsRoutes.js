const express = require("express");

const getAnalytics = require("../controllers/analyticsController");

const router = express.Router();

// Analytics API Endpoint
router.get("/", getAnalytics);

module.exports = router;
