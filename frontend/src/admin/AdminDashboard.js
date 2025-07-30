import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  // Helper to check if link is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 shadow-lg rounded-r-2xl flex flex-col">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <span role="img" aria-label="admin">⚙️</span> Admin Panel
        </h2>
        <nav className="flex flex-col gap-4">
          <Link
            to="/admin/products"
            className={`block px-4 py-2 rounded transition ${
              isActive('/admin/products') ? 'bg-gray-800 font-semibold' : 'hover:bg-gray-800'
            }`}
          >
            📦 Products
          </Link>
          <Link
            to="/admin/orders"
            className={`block px-4 py-2 rounded transition ${
              isActive('/admin/orders') ? 'bg-gray-800 font-semibold' : 'hover:bg-gray-800'
            }`}
          >
            📑 Orders
          </Link>
          <Link
            to="/admin/products/add"
            className={`block px-4 py-2 rounded transition ${
              isActive('/admin/products/add') ? 'bg-gray-800 font-semibold' : 'hover:bg-gray-800'
            }`}
          >
            ➕ Add Product
          </Link>
          <Link
            to="/admin/categories"
            className={`block px-4 py-2 rounded transition ${
              isActive('/admin/categories') ? 'bg-gray-800 font-semibold' : 'hover:bg-gray-800'
            }`}
          >
            📂 Categories
          </Link>
          <button
            onClick={handleLogout}
            className="mt-8 px-4 py-2 rounded text-red-400 hover:bg-red-800 hover:text-white transition"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;