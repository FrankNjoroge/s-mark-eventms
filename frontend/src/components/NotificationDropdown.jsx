// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Bell } from "lucide-react";
// import { Link } from "react-router-dom";
// import { format } from "date-fns";
// import { notificationService } from "../services/api";
// import { useAuth } from "../context/AuthContext";

// const NotificationDropdown = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const dropdownRef = useRef(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchNotifications();

//     // Set up polling for new notifications every minute
//     const interval = setInterval(fetchNotifications, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     // Handle clicks outside the dropdown to close it
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [dropdownRef]);

//   const fetchNotifications = async () => {
//     if (!user) return;

//     try {
//       setLoading(true);
//       const data = await notificationService.getUserNotifications();

//       if (Array.isArray(data)) {
//         setNotifications(data);
//         // Count unread notifications
//         const unread = data.filter((notification) => !notification.read).length;
//         setUnreadCount(unread);
//       }
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkAsRead = async (id) => {
//     try {
//       await notificationService.markNotificationAsRead(id);
//       // Update local state
//       setNotifications(
//         notifications.map((notification) =>
//           notification._id === id
//             ? { ...notification, read: true }
//             : notification
//         )
//       );
//       setUnreadCount((prev) => Math.max(0, prev - 1));
//     } catch (err) {
//       console.error("Failed to mark notification as read:", err);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       await notificationService.markAllNotificationsAsRead();
//       // Update local state
//       setNotifications(
//         notifications.map((notification) => ({ ...notification, read: true }))
//       );
//       setUnreadCount(0);
//     } catch (err) {
//       console.error("Failed to mark all notifications as read:", err);
//     }
//   };

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   // Determine user type for filtering notifications
//   const userType =
//     user?.role === "admin" ? "admin" : user?.isVendor ? "vendors" : "attendees";

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={toggleDropdown}
//         className="relative p-1 rounded-full text-gray-500 hover:text-indigo-600 focus:outline-none"
//         aria-label="Notifications"
//       >
//         <Bell className="h-6 w-6" />
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform translate-x-1 -translate-y-1">
//             {unreadCount > 9 ? "9+" : unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
//           <div className="py-2 px-3 bg-gray-50 border-b flex justify-between items-center">
//             <h3 className="text-sm font-semibold text-gray-700">
//               Notifications
//             </h3>
//             {unreadCount > 0 && (
//               <button
//                 onClick={handleMarkAllAsRead}
//                 className="text-xs text-indigo-600 hover:text-indigo-800"
//               >
//                 Mark all as read
//               </button>
//             )}
//           </div>

//           <div className="max-h-96 overflow-y-auto">
//             {loading ? (
//               <div className="py-4 text-center text-gray-500">
//                 Loading notifications...
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="py-4 text-center text-gray-500">
//                 No notifications
//               </div>
//             ) : (
//               <div>
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification._id}
//                     className={`p-3 border-b hover:bg-gray-50 ${
//                       !notification.read ? "bg-blue-50" : ""
//                     }`}
//                   >
//                     <div className="flex justify-between items-start">
//                       <h4 className="text-sm font-medium text-gray-900">
//                         {notification.title}
//                       </h4>
//                       <span className="text-xs text-gray-500">
//                         {format(
//                           new Date(
//                             notification.sentAt || notification.createdAt
//                           ),
//                           "MMM d, h:mm a"
//                         )}
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                       {notification.message}
//                     </p>
//                     {!notification.read && (
//                       <button
//                         onClick={() => handleMarkAsRead(notification._id)}
//                         className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
//                       >
//                         Mark as read
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="py-2 px-3 bg-gray-50 border-t text-center">
//             <Link
//               to="/notifications/all"
//               className="text-xs text-indigo-600 hover:text-indigo-800"
//               onClick={() => setIsOpen(false)}
//             >
//               View all notifications
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;
