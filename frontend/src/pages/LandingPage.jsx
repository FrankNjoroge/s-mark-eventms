"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventService } from "../services/api";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { format, isValid } from "date-fns";

const LandingPage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getEvents();
        const data = await response.events;
        setFeaturedEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Features section data
  const features = [
    {
      title: "Easy Event Creation",
      description:
        "Create and manage events with just a few clicks. Add details, set capacity, and publish instantly.",
      icon: Calendar,
    },
    {
      title: "Attendee Management",
      description:
        "Track registrations, manage attendee information, and communicate with your audience.",
      icon: Users,
    },
    {
      title: "Secure Payments",
      description:
        "Accept payments securely through multiple payment gateways with real-time tracking.",
      icon: CheckCircle,
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote:
        "This platform made organizing our annual conference so much easier. Highly recommended!",
      author: "Sarah Johnson",
      role: "Event Director",
      company: "Tech Innovations",
    },
    {
      quote:
        "The attendee management features saved us countless hours of manual work.",
      author: "Michael Chen",
      role: "Community Manager",
      company: "Startup Hub",
    },
    {
      quote:
        "We've increased our event attendance by 40% since using this platform.",
      author: "Emily Rodriguez",
      role: "Marketing Lead",
      company: "Growth Partners",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover, Create, and Manage Amazing Events
            </h1>
            <p className="text-xl mb-8">
              The all-in-one platform for event organizers and attendees to
              connect, engage, and create memorable experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                Browse Events
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-16 bg-white"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
        ></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link
              to="/events"
              className="text-indigo-600 font-medium flex items-center hover:text-indigo-800"
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No upcoming events
              </h3>
              <p className="mt-1 text-gray-500">
                Check back soon for exciting events!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredEvents.map((event) => {
                const eventDate = event.date ? new Date(event.date) : null;
                let eventTime = event.time ? new Date(event.time) : null;

                if (event.time && event.date) {
                  // Combine date and time to create a full Date object
                  const [hours, minutes, seconds] = event.time.split(":");
                  eventTime = new Date(eventDate);
                  eventTime.setHours(hours, minutes, seconds || 0);
                }

                return (
                  <div
                    key={event._id}
                    className="bg-white rounded-lg shadow-md"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {event.title}
                      </h3>

                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {eventDate && isValid(eventDate)
                            ? format(eventDate, "MMMM d, yyyy")
                            : "Date not available"}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {eventTime && isValid(eventTime)
                            ? format(eventTime, "h:mm a")
                            : "Time not available"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Create Your Next Event?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who are creating memorable
            experiences with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
