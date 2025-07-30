import React, { useState } from 'react';
import axios from 'axios';

const PaymentButton = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    const token = localStorage.getItem('access');
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8000/api/orders/create-checkout-session/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = res.data.url; // Redirect to Stripe
    } catch (err) {
      console.error('Stripe session error:', err);
      alert('❌ Could not initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`mt-4 w-full bg-green-600 text-white px-4 py-3 rounded font-semibold hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Processing...' : '💳 Pay with Stripe'}
    </button>
  );
};

export default PaymentButton;