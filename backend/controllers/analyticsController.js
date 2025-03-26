const Event = require("../models/Event.js");
const User = require("../models/User.js");
const Booking = require("../models/Booking.js");

const getAnalytics = async (req, res) => {
  try {
    const { timeRange } = req.query; // 'week', 'month', 'year'
    const now = new Date();

    let startDate;
    if (timeRange === "week") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === "month") {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (timeRange === "year") {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    } else {
      return res.status(400).json({ message: "Invalid timeRange parameter" });
    }

    // Total Events
    const totalEvents = await Event.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Total Users
    const totalUsers = await User.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Total Registrations
    const totalRegistrationsResult = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: { _id: null, totalRegistrations: { $sum: "$numberOfTickets" } },
      },
    ]);

    const totalRegistrations = totalRegistrationsResult.length
      ? totalRegistrationsResult[0].totalRegistrations
      : 0;

    //Total Revenue
    const totalRevenueResult = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } }, // Filter by time range
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }, // Sum all bookings' totalPrice
    ]);

    const totalRevenue = totalRevenueResult.length
      ? totalRevenueResult[0].totalRevenue
      : 0;

    // Events by Category
    const eventsByCategory = await Event.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: "$category", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } },
    ]);

    // Registrations by Month
    const registrationsByMonth = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(
              new Date().setFullYear(new Date().getFullYear() - 1)
            ),
          },
        },
      }, // Filter last 12 months
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month (1 = Jan, 12 = Dec)
          totalRegistrations: { $sum: "$numberOfTickets" }, // Sum all ticket registrations per month
        },
      },
      { $sort: { _id: 1 } }, // Sort by month (ascending)
    ]);

    // Convert month numbers (1-12) into month names
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedRegistrationsByMonth = registrationsByMonth.map((entry) => ({
      name: monthNames[entry._id - 1], // Convert month number to name
      registrations: entry.totalRegistrations || 0,
    }));

    console.log("Registrations By Month:", formattedRegistrationsByMonth); // ✅ Debugging Log

    // Top 5 Events by Registrations
    const topEvents = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$eventId",
          registrations: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
      { $sort: { registrations: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      {
        $project: {
          name: { $arrayElemAt: ["$eventDetails.name", 0] },
          registrations: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    // User Growth by Month
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: { $month: "$createdAt" }, users: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      {
        $project: {
          name: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  { $subtract: ["$_id", 1] },
                ],
              },
            ],
          },
          users: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      totalEvents,
      totalUsers,
      totalRegistrations,
      totalRevenue,
      eventsByCategory,
      registrationsByMonth: formattedRegistrationsByMonth,
      topEvents,
      userGrowth,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getAnalytics;
