"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CreditCard } from "lucide-react";

const PaymentSummary = ({
  subtotal,
  serviceFee,
  total,
  currency = "KES",
  paymentMethod,
  showDetails = true,
}) => {
  const [expanded, setExpanded] = useState(showDetails);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Payment Summary</h3>
        {!(showDetails && expanded) && ( // Ensure the button is available when needed
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {(expanded || showDetails) && (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fee</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            {paymentMethod && (
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <span className="text-gray-600">Payment Method</span>
                <span className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                  {paymentMethod.cardBrand} •••• {paymentMethod.lastFourDigits}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-200">
            <span>Total</span>
            <span className="flex items-center">{formatCurrency(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;
