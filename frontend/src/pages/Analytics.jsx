"use client";

import { useState, useEffect } from "react";
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
  const [timeRange, setTimeRange] = useState("month"); // 'week', 'month', 'year'

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // In a real app, you would have a dedicated analytics endpoint
        // For now, we'll simulate with mock data

        // Simulate API call
        // const response = await api.get(`/analytics?timeRange=${timeRange}`)
        // setStats(response.data)

        // Mock data for demonstration
        const mockData = generateMockData(timeRange);
        setStats(mockData);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // Function to generate mock data for demonstration
  const generateMockData = () => {
    // Categories for events
    const categories = [
      "Conference",
      "Workshop",
      "Seminar",
      "Networking",
      "Party",
      "Concert",
    ];

    // Generate random data for each category
    const eventsByCategory = categories.map((category) => ({
      name: category,
      value: Math.floor(Math.random() * 50) + 5,
    }));

    // Calculate total events
    const totalEvents = eventsByCategory.reduce(
      (sum, item) => sum + item.value,
      0
    );

    // Generate monthly data
    const months = [
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
    const registrationsByMonth = months.map((month) => ({
      name: month,
      registrations: Math.floor(Math.random() * 100) + 10,
      revenue: Math.floor(Math.random() * 5000) + 500,
    }));

    // Generate top events
    const topEvents = [
      { name: "Annual Tech Conference", registrations: 120, revenue: 12000 },
      { name: "Summer Music Festival", registrations: 85, revenue: 8500 },
      { name: "Business Networking Mixer", registrations: 65, revenue: 3250 },
      { name: "Web Development Workshop", registrations: 50, revenue: 2500 },
      { name: "Leadership Seminar", registrations: 45, revenue: 4500 },
    ];

    // Generate user growth data
    const userGrowth = months.map((month) => ({
      name: month,
      users: Math.floor(Math.random() * 50) + 5,
    }));

    return {
      totalEvents,
      totalUsers: 350,
      totalRegistrations: 850,
      totalRevenue: 45000,
      eventsByCategory,
      registrationsByMonth,
      topEvents,
      userGrowth,
    };
  };

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
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Registrations</p>
              <p className="text-2xl font-bold">{stats.totalRegistrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
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
                  fill="#8884d8"
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
            <ResponsiveContainer width="100%" height="100%">
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
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Performing Events
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.topEvents.map((event, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.registrations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${event.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            User Growth
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.userGrowth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#82ca9d" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

// "use client";

// import { useState, useEffect, useMemo, lazy, Suspense } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import { Calendar, Users, DollarSign, TrendingUp, Filter } from "lucide-react";

// const Analytics = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timeRange, setTimeRange] = useState("month");
//   const [stats, setStats] = useState({
//     totalEvents: 0,
//     totalUsers: 0,
//     totalRegistrations: 0,
//     totalRevenue: 0,
//     eventsByCategory: [],
//     registrationsByMonth: [],
//     topEvents: [],
//     userGrowth: [],
//   });

//   // Fetch analytics data from backend
//   useEffect(() => {
//     let timeout = setTimeout(async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `/api/analytics?timeRange=${timeRange}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch analytics data");
//         }
//         const data = await response.json();
//         setStats(data);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching analytics:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }, 500); // Debounce API call

//     return () => clearTimeout(timeout); // Cleanup timeout on re-render
//   }, [timeRange]);

//   // Lazy-load charts for better performance
//   const LazyBarChart = lazy(() => import("recharts/BarChart"));

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//         <strong className="font-bold">Error!</strong>
//         <span className="block sm:inline"> {error}</span>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
//         <div className="flex items-center space-x-2">
//           <Filter className="h-5 w-5 text-gray-500" />
//           <select
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//             className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="week">Last Week</option>
//             <option value="month">Last Month</option>
//             <option value="year">Last Year</option>
//           </select>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {[
//           { label: "Total Events", value: stats.totalEvents, icon: <Calendar /> },
//           { label: "Total Users", value: stats.totalUsers, icon: <Users /> },
//           { label: "Total Registrations", value: stats.totalRegistrations, icon: <TrendingUp /> },
//           { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign /> },
//         ].map((card, index) => (
//           <div key={index} className="bg-white p-6 rounded-lg shadow-md">
//             <div className="flex items-center">
//               <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">{card.icon}</div>
//               <div>
//                 <p className="text-sm text-gray-500">{card.label}</p>
//                 <p className="text-2xl font-bold">{card.value}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Events by Category</h2>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={stats.eventsByCategory}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {stats.eventsByCategory.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Registrations by Month</h2>
//           <div className="h-80">
//             <Suspense fallback={<p>Loading Chart...</p>}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LazyBarChart data={stats.registrationsByMonth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="registrations" fill="#8884d8" name="Registrations" />
//                 </LazyBarChart>
//               </ResponsiveContainer>
//             </Suspense>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;
