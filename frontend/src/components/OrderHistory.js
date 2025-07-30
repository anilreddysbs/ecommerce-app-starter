import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('access');

  useEffect(() => {
    if (!token) return;

    axios.get('http://localhost:8000/api/orders/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setOrders(res.data))
    .catch(err => console.error("Error fetching order history:", err));
  }, [token]);

  if (!token) {
    return <p className="p-4">Please login to view your order history.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="orders">📜</span> Order History
      </h2>
      {orders.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No past orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border p-6 rounded shadow bg-white">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">🆔 Order ID: <span className="text-blue-700">{order.id}</span></p>
                <span className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-sm font-medium">{order.status}</span>
              </div>
              <p className="text-gray-600 mb-2">Placed on: {new Date(order.created_at).toLocaleString()}</p>
              <ul className="mt-2 pl-5 list-disc text-gray-700">
                {order.items.map(item => (
                  <li key={item.id}>
                    {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;