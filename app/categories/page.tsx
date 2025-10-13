'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, FolderOpen } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  type: 'expense' | 'income';
  icon: string;
  color: string;
  isDefault: boolean;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'expense' | 'income',
    color: '#3b82f6',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert('Category added successfully!');
        setShowForm(false);
        setFormData({ name: '', type: 'expense', color: '#3b82f6' });
        fetchCategories();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };

  const handleDelete = async (id: string, isDefault: boolean) => {
    if (isDefault) {
      alert('Cannot delete default categories');
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Category deleted successfully');
        fetchCategories();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Categories</h1>
          <p className="text-gray-500 mt-1">Manage your transaction categories</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as 'expense' | 'income' })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-12 border border-gray-300 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600">{formData.color}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
              >
                Add Category
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Expense Categories */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Expense Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenseCategories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <FolderOpen
                          className="w-6 h-6"
                          style={{ color: category.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{category.type}</p>
                        {category.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    {!category.isDefault && (
                      <button
                        onClick={() => handleDelete(category._id, category.isDefault)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Income Categories */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Income Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomeCategories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <FolderOpen
                          className="w-6 h-6"
                          style={{ color: category.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{category.type}</p>
                        {category.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    {!category.isDefault && (
                      <button
                        onClick={() => handleDelete(category._id, category.isDefault)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
