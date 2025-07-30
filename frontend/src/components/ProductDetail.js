import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Please log in first.');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/cart/',
        {
          product_id: product.id,
          quantity: quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Product added to cart');
      navigate('/cart');
    } catch (error) {
      console.error(error);
      if (error.response?.data) {
        alert('Failed to add to cart: ' + JSON.stringify(error.response.data));
      } else {
        alert('Failed to add to cart');
      }
    }
  };

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded-lg shadow p-8">
      <h2 className="text-3xl font-bold mb-4 text-blue-700">{product.name}</h2>
      <p className="text-xl mb-2 font-semibold text-green-600">₹{product.price}</p>
      <p className="mb-6 text-gray-700">{product.description}</p>

      <div className="flex items-center gap-4 mb-6">
        <label htmlFor="quantity" className="font-medium">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          className="border px-3 py-2 rounded w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setQuantity(parseInt(e.target.value))}
        />
      </div>
      <button
        onClick={handleAddToCart}
        className="w-full bg-green-600 text-white font-semibold py-3 rounded hover:bg-green-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;