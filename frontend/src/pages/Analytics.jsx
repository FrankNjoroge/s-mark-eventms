"use client";

import { useState, useEffect, Suspense } from "react";
import { analyticsService } from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Users, DollarSign, TrendingUp, Filter } from "lucide-react";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    eventsByCategory: [],
    registrationsByMonth: [],
    topEvents: [],
    userGrowth: [],
  });
  useEffect(() => {
    let timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getAnalytics(timeRange);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce API call

    return () => clearTimeout(timeout);
  }, [timeRange]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Analytics Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Events",
            value: stats.totalEvents,
            icon: <Calendar />,
          },
          { label: "Total Users", value: stats.totalUsers, icon: <Users /> },
          {
            label: "Total Registrations",
            value: stats.totalRegistrations,
            icon: <TrendingUp />,
          },
          {
            label: "Total Revenue",
            value: `Ksh ${stats.totalRevenue.toLocaleString()}`,
            icon: <DollarSign />,
          },
        ].map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Events by Category
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.eventsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {stats.eventsByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Registrations by Month
          </h2>
          <div className="h-80">
            <Suspense fallback={<p>Loading Chart...</p>}>
              <ResponsiveContainer width="100%" height="100%">
                {stats.registrationsByMonth?.length > 0 ? (
                  <BarChart
                    data={stats.registrationsByMonth}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="registrations"
                      fill="#8884d8"
                      name="Registrations"
                    />
                  </BarChart>
                ) : (
                  <p className="text-gray-500">
                    No registration data available
                  </p>
                )}
              </ResponsiveContainer>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
