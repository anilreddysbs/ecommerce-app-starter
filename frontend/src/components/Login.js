import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/users/login/', {
        username,
        password
      });

      const access = res.data.access;
      const refresh = res.data.refresh;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      const decoded = jwtDecode(access);
      localStorage.setItem('is_admin', decoded.is_admin);
      localStorage.setItem('is_customer', decoded.is_customer);

      alert('✅ Login successful');

      // Redirect based on role
      if (decoded.is_admin) {
        navigate('/admin/products');
      } else {
        navigate('/');
      }

    } catch (error) {
      alert('Login failed');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="login">🔐</span> Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;