"use client";

import { CheckCircle, Download, Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import PaymentSummary from "./PaymentSummary";

const PaymentConfirmation = ({
  paymentId,
  event,
  bookingDetails,
  paymentMethod,
  paymentAmount,
  onClose,
}) => {
  const handleDownloadReceipt = () => {
    // In a real app, you would generate and download a PDF receipt
    alert("In a real app, this would download a PDF receipt");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
      <div className="bg-green-50 p-6 flex items-center justify-center border-b border-green-100">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600">
            Your booking has been confirmed and tickets have been sent to your
            email.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Booking Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Booking Details
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-lg mb-2">{event.title}</h4>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  {format(new Date(event.date), "MMMM d, yyyy")}
                  {event.time && /^\d{2}:\d{2}$/.test(event.time)
                    ? format(new Date(`1970-01-01T${event.time}`), "h:mm a")
                    : "Invalid Time"}
                </span>
              </div>

              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span>
                  {bookingDetails.numberOfTickets}{" "}
                  {bookingDetails.numberOfTickets === 1 ? "ticket" : "tickets"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <PaymentSummary
          subtotal={paymentAmount.subtotal}
          serviceFee={paymentAmount.serviceFee}
          total={paymentAmount.total}
          paymentMethod={paymentMethod}
          showDetails={true}
        />

        {/* Confirmation Number */}
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-1">Confirmation Number</p>
          <p className="font-mono font-medium text-lg">{paymentId}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handleDownloadReceipt}
            className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </button>

          <Link
            to={`/events/${event._id}`}
            className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View Event Details
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-200 text-center">
        <button
          onClick={onClose}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
