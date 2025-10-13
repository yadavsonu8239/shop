'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  type: 'expense' | 'income';
}

export default function AddEntry() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'expense' | 'income',
    category: '',
    paymentType: 'cash' as 'cash' | 'upi' | 'bank',
    description: '',
    amount: '',
  });

  useEffect(() => {
    fetchCategories();
    initializeDefaultCategories();
  }, []);

  const initializeDefaultCategories = async () => {
    try {
      await fetch('/api/init', { method: 'POST' });
    } catch (error) {
      console.error('Error initializing categories:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
        if (data.data.length > 0) {
          const firstExpense = data.data.find((c: Category) => c.type === 'expense');
          if (firstExpense) {
            setFormData((prev) => ({ ...prev, category: firstExpense.name }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Transaction added successfully!');
        router.push('/');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6 lg:mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Finance Entry</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Record a new transaction for your shop</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: 'expense', category: '' });
                }}
                className={`p-4 rounded-lg border-2 transition-all ${formData.type === 'expense'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💸</div>
                  <div className="font-medium">Expense</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, type: 'income', category: '' });
                }}
                className={`p-4 rounded-lg border-2 transition-all ${formData.type === 'income'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-medium">Income</div>
                </div>
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {filteredCategories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {['cash', 'upi', 'bank'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      paymentType: type as 'cash' | 'upi' | 'bank',
                    })
                  }
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all capitalize text-sm sm:text-base ${formData.paymentType === type
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              rows={3}
              placeholder="Enter transaction details..."
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
              placeholder="0.00"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Transaction
                </>
              )}
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 text-center text-sm sm:text-base"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
