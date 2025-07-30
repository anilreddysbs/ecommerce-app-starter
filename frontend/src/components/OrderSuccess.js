import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="max-w-xl mx-auto text-center mt-20 bg-white rounded-lg shadow p-10">
      <h1 className="text-3xl font-bold mb-4 text-green-600 flex items-center justify-center gap-2">
        <span role="img" aria-label="success">🎉</span> Payment Successful!
      </h1>
      <p className="text-lg mb-6 text-gray-700">Your order has been confirmed.</p>
      <Link
        to="/orders"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
      >
        👉 View your orders
      </Link>
    </div>
  );
};

export default Success;