import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus, setAuthToken } from '../api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('access');
      setAuthToken(token);

      const res = await fetchOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert('✅ Order status updated');
      loadOrders();
    } catch (err) {
      console.error(err.response?.data || err);
      alert('❌ Failed to update status');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const statusOptions = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="orders">📑</span> Manage Orders
      </h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="border mb-6 p-6 rounded shadow-sm bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-semibold">Order ID: <span className="text-blue-700">{order.id}</span></p>
                <p>User: <span className="font-medium">{order.user?.username}</span> <span className="text-gray-500">({order.user?.email})</span></p>
                <p>Date: <span className="text-gray-700">{new Date(order.created_at).toLocaleString()}</span></p>
              </div>
              <div>
                <label className="mr-2 font-medium">Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-2">Items:</p>
              <ul className="list-disc pl-6 text-gray-700">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderManagement;