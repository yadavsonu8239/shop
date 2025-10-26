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
  Calendar,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import RecentTransactions from '@/components/RecentTransactions';
import ChartSection from '@/components/ChartSection';
import DatePicker from '@/components/DatePicker';
import { format } from 'date-fns';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchStats();
  }, [period, selectedDate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      let url = `/api/stats?period=${period}`;

      // If a custom date is selected, add it to the query
      if (selectedDate && period === 'custom') {
        url += `&date=${format(selectedDate, 'yyyy-MM-dd')}`;
      }

      const res = await fetch(url);
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

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setPeriod('custom');
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

      {/* Period Selector and Date Picker */}
      <div className="mb-6 flex flex-col gap-3">
        {/* Date Picker - First on mobile, left on desktop */}
        <div className="w-full sm:w-auto sm:max-w-[240px]">
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>

        {/* Period Selector Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1">
          <button
            onClick={() => {
              setPeriod('today');
              setSelectedDate(null);
            }}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${period === 'today'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            Today
          </button>
          <button
            onClick={() => {
              setPeriod('month');
              setSelectedDate(null);
            }}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${period === 'month'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            This Month
          </button>
          <button
            onClick={() => {
              setPeriod('all');
              setSelectedDate(null);
            }}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${period === 'all'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Selected Date Display */}
      {selectedDate && period === 'custom' && (
        <div className="mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-blue-600 font-medium">
              Showing data for: <span className="font-bold">{format(selectedDate, 'MMMM dd, yyyy')}</span>
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedDate(null);
              setPeriod('month');
            }}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium underline"
          >
            Clear Selection
          </button>
        </div>
      )}

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
          <ChartSection period={period} selectedDate={selectedDate} />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
