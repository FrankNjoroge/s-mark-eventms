import { Link } from "react-router-dom";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold">S-Mark</span>
            </div>
            <p className="text-gray-400 mb-4">
              The all-in-one platform for event organizers and attendees to
              connect, engage, and create memorable experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Event Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/events?category=Conference"
                  className="text-gray-400 hover:text-white"
                >
                  Conferences
                </Link>
              </li>
              <li>
                <Link
                  to="/events?category=Workshop"
                  className="text-gray-400 hover:text-white"
                >
                  Workshops
                </Link>
              </li>
              <li>
                <Link
                  to="/events?category=Networking"
                  className="text-gray-400 hover:text-white"
                >
                  Networking
                </Link>
              </li>
              <li>
                <Link
                  to="/events?category=Concert"
                  className="text-gray-400 hover:text-white"
                >
                  Concerts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-indigo-400" />
                <span className="text-gray-400">
                  123 Moi Avenue, Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-indigo-400" />
                <span className="text-gray-400">+254 (755) 123-456</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-indigo-400" />
                <span className="text-gray-400">info@s-mark.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} S-Mark. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
