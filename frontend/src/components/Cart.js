import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = async () => {
    const token = localStorage.getItem('access');
    try {
      const res = await axios.get('http://localhost:8000/api/cart/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const removeItem = async (id) => {
    const token = localStorage.getItem('access');
    try {
      await axios.delete(`http://localhost:8000/api/cart/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleMockPayment = async () => {
    const token = localStorage.getItem('access');
    try {
      // 1. Place order and get its ID directly
      const orderRes = await axios.post(
        'http://localhost:8000/api/orders/place/',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2. Call the mock pay endpoint using the returned order ID
      await axios.post(
        `http://localhost:8000/api/orders/${orderRes.data.id}/pay/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = '/success';
    } catch (err) {
      console.error('Mock payment error:', err);
      alert('❌ Failed to process payment');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="cart">🛒</span> Your Cart
      </h1>
      {cart.items.length === 0 ? (
        <div className="bg-white rounded shadow p-8 text-center">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow p-8">
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border p-4 rounded hover:shadow transition"
              >
                <div>
                  <p className="font-semibold text-lg">{item.product.name}</p>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:underline px-3 py-1 rounded transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-6 w-full bg-green-600 text-white font-semibold px-4 py-3 rounded hover:bg-green-700 transition"
            onClick={handleMockPayment}
          >
            💳 Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;