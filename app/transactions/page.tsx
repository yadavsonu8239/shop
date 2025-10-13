'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Filter, ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  _id: string;
  date: string;
  category: string;
  type: 'expense' | 'income';
  paymentType: string;
  description: string;
  amount: number;
}

interface Category {
  _id: string;
  name: string;
  type: string;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchTransactions();
        alert('Transaction deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Transactions</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">View and manage all your financial transactions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={clearFilters}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No transactions found</p>
            <Link
              href="/add"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Add Your First Transaction
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'income' ? (
                            <ArrowUpCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowDownCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span
                            className={`text-sm capitalize ${transaction.type === 'income'
                              ? 'text-green-600'
                              : 'text-red-600'
                              }`}
                          >
                            {transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {transaction.paymentType}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                          }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {transaction.type === 'income' ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{transaction.category}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                          }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{transaction.paymentType}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{transaction.description}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Summary */}
      {!loading && transactions.length > 0 && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Income</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(
                  transactions
                    .filter((t) => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {formatCurrency(
                  transactions
                    .filter((t) => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
