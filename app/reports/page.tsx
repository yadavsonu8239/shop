'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface Stats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  cashTotal: number;
  upiTotal: number;
  bankTotal: number;
}

export default function Reports() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsRes = await fetch(`/api/stats?period=${period}`);
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch transactions
      const transRes = await fetch('/api/transactions');
      const transData = await transRes.json();
      if (transData.success) {
        setTransactions(transData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  // Payment method data
  const paymentData = [
    { name: 'Cash', value: stats?.cashTotal || 0, color: '#10b981' },
    { name: 'UPI', value: stats?.upiTotal || 0, color: '#3b82f6' },
    { name: 'Bank', value: stats?.bankTotal || 0, color: '#f59e0b' },
  ].filter((item) => item.value > 0);

  // Income vs Expense comparison
  const comparisonData = [
    {
      name: 'Financial Overview',
      Income: stats?.totalIncome || 0,
      Expenses: stats?.totalExpenses || 0,
      Profit: stats?.netProfit || 0,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Detailed insights and analytics of your shop finances</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setPeriod('today')}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${period === 'today'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
        >
          Today
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${period === 'month'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
        >
          This Month
        </button>
        <button
          onClick={() => setPeriod('all')}
          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${period === 'all'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
        >
          All Time
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-700">Income</span>
          </div>
          <p className="text-3xl font-bold text-green-900">
            {formatCurrency(stats?.totalIncome || 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <span className="text-sm font-medium text-red-700">Expenses</span>
          </div>
          <p className="text-3xl font-bold text-red-900">
            {formatCurrency(stats?.totalExpenses || 0)}
          </p>
        </div>

        <div
          className={`bg-gradient-to-br p-6 rounded-lg border ${stats && stats.netProfit >= 0
            ? 'from-blue-50 to-blue-100 border-blue-200'
            : 'from-orange-50 to-orange-100 border-orange-200'
            }`}
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign
              className={`w-8 h-8 ${stats && stats.netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
                }`}
            />
            <span
              className={`text-sm font-medium ${stats && stats.netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'
                }`}
            >
              {stats && stats.netProfit >= 0 ? 'Profit' : 'Loss'}
            </span>
          </div>
          <p
            className={`text-3xl font-bold ${stats && stats.netProfit >= 0 ? 'text-blue-900' : 'text-orange-900'
              }`}
          >
            {formatCurrency(Math.abs(stats?.netProfit || 0))}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Income vs Expenses */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="Income" fill="#10b981" />
              <Bar dataKey="Expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        {paymentData.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Cash Transactions</p>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(stats?.cashTotal || 0)}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">UPI Transactions</p>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(stats?.upiTotal || 0)}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Bank Transactions</p>
            <p className="text-2xl font-bold text-orange-900">
              {formatCurrency(stats?.bankTotal || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
