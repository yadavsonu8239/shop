'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
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
import { format } from 'date-fns';

interface ChartSectionProps {
  period: string;
  selectedDate?: Date | null;
}

export default function ChartSection({ period, selectedDate }: ChartSectionProps) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [period, selectedDate]);

  const fetchData = async () => {
    try {
      let url = `/api/stats?period=${period}`;

      // If a custom date is selected, add it to the query
      if (selectedDate && period === 'custom') {
        url += `&date=${format(selectedDate, 'yyyy-MM-dd')}`;
      }

      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  if (!data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const barData = [
    {
      name: 'Overview',
      Income: data.totalIncome,
      Expenses: data.totalExpenses,
    },
  ];

  const pieData = [
    { name: 'Raw Material', value: data.shopRawMaterial, color: '#f59e0b' },
    { name: 'Electricity', value: data.electricityBills, color: '#eab308' },
    { name: 'Personal', value: data.personalSpending, color: '#8b5cf6' },
    { name: 'Home', value: data.homeSpending, color: '#ec4899' },
    { name: 'Other', value: data.otherExpenses, color: '#6b7280' },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Financial Overview</h2>

      <div className="mb-6 sm:mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <Legend />
            <Bar dataKey="Income" fill="#10b981" />
            <Bar dataKey="Expenses" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {pieData.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(value)
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
