import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const token = localStorage.getItem('access');

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/products/products/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/products/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('✅ Product deleted successfully');
    } catch (err) {
      console.error('❌ Delete failed:', err.response?.data || err);
      alert('❌ Failed to delete product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      ...product,
      category_id: product.category?.id || product.category_id || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }));
  };

  const handleEditSave = async () => {
    try {
      const payload = {
        name: editingProduct.name,
        price: editingProduct.price,
        stock: editingProduct.stock,
        description: editingProduct.description || '',
        category_id: editingProduct.category_id,
      };

      await axios.put(
        `http://localhost:8000/api/products/products/${editingProduct.id}/`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('✅ Product updated');
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('❌ Update failed:', err.response?.data || err);
      alert('❌ Failed to update product');
    }
  };

  const handleEditCancel = () => setEditingProduct(null);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="products">📦</span> Manage Products
      </h2>
      <table className="w-full table-auto border-collapse mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Price</th>
            <th className="border px-4 py-2 text-left">Stock</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{p.id}</td>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">₹{p.price}</td>
              <td className="border px-4 py-2">{p.stock}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-sm text-blue-600 mr-2 hover:underline"
                  onClick={() => handleEditClick(p)}
                >
                  Edit
                </button>
                <button
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <div className="max-w-md mx-auto mt-6 p-6 border rounded bg-white shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span role="img" aria-label="edit">✏️</span> Edit Product
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={editingProduct.name}
              onChange={handleEditChange}
              placeholder="Product Name"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="price"
              value={editingProduct.price}
              onChange={handleEditChange}
              placeholder="Price"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="stock"
              value={editingProduct.stock}
              onChange={handleEditChange}
              placeholder="Stock"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="description"
              value={editingProduct.description}
              onChange={handleEditChange}
              placeholder="Description"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleEditSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={handleEditCancel}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;