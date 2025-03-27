"use client";

import { useState } from "react";
import { CreditCard, Calendar, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

const PaymentMethodForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    saveForFuture: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Add space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: null }));
    }
  };

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData((prev) => ({ ...prev, expiryDate: formatted }));
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Card number validation (16 digits)
    if (!formData.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    // Expiry date validation (MM/YY format)
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    } else {
      // Check if card is not expired
      const [month, year] = formData.expiryDate.split("/");
      const expiryDate = new Date(
        2000 + Number.parseInt(year),
        Number.parseInt(month) - 1
      );
      const currentDate = new Date();

      if (expiryDate < currentDate) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    // CVV validation (3 or 4 digits)
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = "Please enter a valid CVV (3 or 4 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would securely send this data to your payment processor
      // For this demo, we'll simulate a successful payment method addition

      // Simulate API call
      // await paymentService.addPaymentMethod({
      //   cardNumber: formData.cardNumber.replace(/\s/g, ''),
      //   cardholderName: formData.cardholderName,
      //   expiryDate: formData.expiryDate,
      //   saveForFuture: formData.saveForFuture
      // })

      // For demo purposes, we'll just wait a bit
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Payment method added successfully");

      // Return masked card info to parent component
      const lastFourDigits = formData.cardNumber.replace(/\s/g, "").slice(-4);
      onSuccess({
        id: `card_${Date.now()}`,
        type: "credit_card",
        cardBrand: getCardBrand(formData.cardNumber),
        lastFourDigits,
        expiryDate: formData.expiryDate,
        cardholderName: formData.cardholderName,
      });
    } catch (error) {
      console.error("Payment method error:", error);
      toast.error("Failed to add payment method");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardBrand = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, "");

    // Very simplified card brand detection
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5")) return "Mastercard";
    if (number.startsWith("3")) return "American Express";
    if (number.startsWith("6")) return "Discover";

    return "Credit Card";
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Add Payment Method</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Card Number
          </label>
          <div className="relative">
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              className={`pl-10 pr-4 py-2 w-full border ${
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              maxLength={19}
            />
            <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="cardholderName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Cardholder Name
          </label>
          <div className="relative">
            <input
              id="cardholderName"
              name="cardholderName"
              type="text"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={handleChange}
              className={`pl-10 pr-4 py-2 w-full border ${
                errors.cardholderName ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.cardholderName && (
            <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expiry Date
            </label>
            <div className="relative">
              <input
                id="expiryDate"
                name="expiryDate"
                type="text"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleExpiryDateChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.expiryDate ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                maxLength={5}
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="cvv"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CVV
            </label>
            <div className="relative">
              <input
                id="cvv"
                name="cvv"
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={handleChange}
                className={`pl-10 pr-4 py-2 w-full border ${
                  errors.cvv ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                maxLength={4}
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="saveForFuture"
            name="saveForFuture"
            type="checkbox"
            checked={formData.saveForFuture}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="saveForFuture"
            className="ml-2 block text-sm text-gray-700"
          >
            Save this card for future payments
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Add Payment Method"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodForm;
