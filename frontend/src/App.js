import React from 'react'; 
import { Routes, Route } from 'react-router-dom';


import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './admin/AdminDashboard';
import ProductManagement from './admin/ProductManagement';
import OrderManagement from './admin/OrderManagement';
import AddProduct from './admin/AddProduct';
import CategoryManagement from './admin/CategoryManagement';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Success from './components/OrderSuccess';

function App() {
  return (
    <div>
      <div className="p-4"> {/* keep padding for page content only */}
        <Routes>
          {/* Public & User Routes */}
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />

          {/* Admin Routes (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          >
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
