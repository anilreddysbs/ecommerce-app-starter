import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('access');

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/products/')
      .then(res => {
        setProducts(res.data);
        const initialQuantities = {};
        res.data.forEach(p => initialQuantities[p.id] = 1);
        setQuantities(initialQuantities);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({ ...prev, [id]: parseInt(value) }));
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      alert('Please log in to add to cart.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/cart/',
        {
          product_id: productId,
          quantity: quantities[productId] || 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('✅ Product added to cart!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add to cart');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">🛍️ Products</h2>
        <div className="space-x-4 flex items-center">
          <button onClick={() => navigate('/cart')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            🛒 Go to Cart
          </button>
          {token && (
            <Link to="/orders" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
              🧾 Order History
            </Link>
          )}
          {!token ? (
            <>
              <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
              <Link to="/register" className="text-blue-600 font-medium hover:underline">Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="text-red-600 font-medium hover:underline">Logout</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="border p-6 rounded-lg shadow bg-white flex flex-col justify-between">
            <h3 className="font-semibold mb-2 text-lg text-gray-800">{product.name}</h3>
            <p className="mb-1 text-green-600 font-bold">₹{product.price}</p>
            <div className="flex items-center gap-2 mb-2">
              <label htmlFor={`qty-${product.id}`} className="text-sm font-medium">Qty:</label>
              <input
                id={`qty-${product.id}`}
                type="number"
                min="1"
                value={quantities[product.id] || 1}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                className="border px-2 py-1 w-20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => handleAddToCart(product.id)}
              className="bg-green-600 text-white px-3 py-2 rounded w-full mb-2 font-semibold hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
            <Link
              to={`/products/${product.id}`}
              className="text-blue-600 hover:underline text-sm text-center"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;