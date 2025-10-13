'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue' | 'yellow';
}

const colorClasses = {
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    border: 'border-green-200',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    border: 'border-red-200',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
  },
};

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`bg-white p-6 rounded-lg border ${colors.border} shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
    </div>
  );
}
