'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Home as HomeIcon,
  User,
  Zap,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import RecentTransactions from '@/components/RecentTransactions';
import ChartSection from '@/components/ChartSection';

interface Stats {
  totalIncome: number;
  totalExpenses: number;
  shopEarnings: number;
  shopRawMaterial: number;
  electricityBills: number;
  personalSpending: number;
  homeSpending: number;
  otherExpenses: number;
  netProfit: number;
  transactionCount: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stats?period=${period}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">Welcome back! Here's your shop's financial overview.</p>
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

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          title="Total Income"
          value={formatCurrency(stats?.totalIncome || 0)}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(stats?.totalExpenses || 0)}
          icon={TrendingDown}
          color="red"
        />
        <StatCard
          title="Net Profit/Loss"
          value={formatCurrency(stats?.netProfit || 0)}
          icon={DollarSign}
          color={stats && stats.netProfit >= 0 ? 'green' : 'red'}
        />
        <StatCard
          title="Transactions"
          value={stats?.transactionCount.toString() || '0'}
          icon={Package}
          color="blue"
        />
      </div>

      {/* Shop Earnings Highlight */}
      <div className="mb-6 lg:mb-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">💰 Shop Earnings</p>
              <p className="text-3xl sm:text-4xl font-bold mb-2">
                {formatCurrency(stats?.shopEarnings || 0)}
              </p>
              <p className="text-green-100 text-xs sm:text-sm">
                Total revenue from shop operations
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Expense Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Raw Material</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  {formatCurrency(stats?.shopRawMaterial || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Electricity</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  {formatCurrency(stats?.electricityBills || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Personal</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  {formatCurrency(stats?.personalSpending || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <HomeIcon className="w-5 h-5 text-pink-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Home Spending</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
                  {formatCurrency(stats?.homeSpending || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <ChartSection period={period} />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
