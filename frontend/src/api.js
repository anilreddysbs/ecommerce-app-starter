// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

// ✅ Add these reusable API calls
export const fetchOrders = () => API.get('/orders/');
export const updateOrderStatus = (orderId, status) =>
  API.patch(`/orders/${orderId}/update-status/`, { status });
export const mockPay = (orderId) =>
  API.post(`/orders/${orderId}/pay/`);

export default API;
