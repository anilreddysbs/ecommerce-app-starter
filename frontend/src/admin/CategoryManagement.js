import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryManagement = () => {
  const token = localStorage.getItem('access');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/products/categories/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, [token]);

  const handleAdd = async () => {
    if (!newCategory) return;

    try {
      await axios.post(
        'http://localhost:8000/api/products/categories/',
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory('');
      // Refetch
      const res = await axios.get('http://localhost:8000/api/products/categories/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add category');
    }
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/products/categories/${editingId}/`,
        { name: editingName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      setEditingName('');
      const res = await axios.get('http://localhost:8000/api/products/categories/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/products/categories/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get('http://localhost:8000/api/products/categories/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to delete category');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="categories">📂</span> Manage Categories
      </h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New category name"
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        />
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          ➕ Add
        </button>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{cat.id}</td>
              <td className="border px-4 py-2">
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    className="border px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td className="border px-4 py-2">
                {editingId === cat.id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="text-green-600 text-sm mr-2 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 text-sm hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(cat.id, cat.name)}
                      className="text-blue-600 text-sm mr-2 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManagement;