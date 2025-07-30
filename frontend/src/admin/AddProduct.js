import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const token = localStorage.getItem('access');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/products/categories/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Error fetching categories', err));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: parseInt(form.stock),
        category_id: form.category,
      };

      await axios.post('http://localhost:8000/api/products/products/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('✅ Product added successfully!');
      setForm({ name: '', description: '', price: '', stock: '', category: '' });
    } catch (err) {
      if (err.response) {
        console.error('❌ Backend error:', err.response.data);
        alert('❌ ' + JSON.stringify(err.response.data));
      } else {
        console.error('❌ Unknown error:', err);
        alert('❌ Failed to add product');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="add">➕</span> Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            min="0"
            step="0.01"
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            min="0"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;