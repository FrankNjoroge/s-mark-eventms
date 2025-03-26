import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center">
      <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
      <p className="text-xl text-gray-600 mb-8">
        You don't have permission to access this page.
      </p>
      <p className="text-gray-500 mb-8">
        Please contact an administrator if you believe this is an error.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Go back home
      </Link>
    </div>
  );
};

export default Unauthorized;
