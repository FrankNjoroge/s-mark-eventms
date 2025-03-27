"use client";

import { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import PaymentMethodForm from "./PaymentMethodForm";

const PaymentMethodSelector = ({ onSelect, selectedMethodId = null }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedId, setSelectedId] = useState(selectedMethodId);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      // In a real app, you would fetch from your API
      // const data = await paymentService.getPaymentMethods()

      // For demo purposes, we'll use mock data
      const mockData = [
        {
          id: "card_1",
          type: "credit_card",
          cardBrand: "Visa",
          lastFourDigits: "4242",
          expiryDate: "12/25",
          cardholderName: "John Doe",
          isDefault: true,
        },
        {
          id: "card_2",
          type: "credit_card",
          cardBrand: "Mastercard",
          lastFourDigits: "5555",
          expiryDate: "10/24",
          cardholderName: "John Doe",
          isDefault: false,
        },
      ];

      setPaymentMethods(mockData);

      // Select default payment method if none is selected
      if (!selectedId && mockData.length > 0) {
        const defaultMethod = mockData.find((m) => m.isDefault) || mockData[0];
        setSelectedId(defaultMethod.id);
        if (onSelect) onSelect(defaultMethod);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (method) => {
    setSelectedId(method.id);
    if (onSelect) onSelect(method);
  };

  const handleAddSuccess = (newMethod) => {
    setPaymentMethods([...paymentMethods, newMethod]);
    setSelectedId(newMethod.id);
    if (onSelect) onSelect(newMethod);
    setShowAddForm(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (
      window.confirm("Are you sure you want to remove this payment method?")
    ) {
      try {
        // In a real app, you would call your API
        // await paymentService.deletePaymentMethod(id)

        // For demo purposes, we'll just update the state
        const updatedMethods = paymentMethods.filter(
          (method) => method.id !== id
        );
        setPaymentMethods(updatedMethods);

        // If the deleted method was selected, select another one
        if (selectedId === id && updatedMethods.length > 0) {
          setSelectedId(updatedMethods[0].id);
          if (onSelect) onSelect(updatedMethods[0]);
        }
      } catch (error) {
        console.error("Error deleting payment method:", error);
      }
    }
  };

  const getCardIcon = (brand) => {
    // In a real app, you would use actual card brand icons
    return <CreditCard className="h-6 w-6" />;
  };

  if (loading) {
    return <div className="animate-pulse h-20 bg-gray-200 rounded-md"></div>;
  }

  if (showAddForm) {
    return (
      <PaymentMethodForm
        onSuccess={handleAddSuccess}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payment Method</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" /> Add New
        </button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-md text-center">
          <p className="text-gray-500 mb-2">No payment methods saved</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
          >
            Add Payment Method
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleSelect(method)}
              className={`p-4 border rounded-md cursor-pointer flex items-center justify-between ${
                selectedId === method.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center">
                <div className="mr-3">{getCardIcon(method.cardBrand)}</div>
                <div>
                  <div className="font-medium">
                    {method.cardBrand} •••• {method.lastFourDigits}
                  </div>
                  <div className="text-sm text-gray-500">
                    Expires {method.expiryDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                {method.isDefault && (
                  <span className="mr-3 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    Default
                  </span>
                )}
                <button
                  onClick={(e) => handleDelete(method.id, e)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
