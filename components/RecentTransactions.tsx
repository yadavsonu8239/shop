'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface Transaction {
  _id: string;
  date: string;
  category: string;
  type: 'expense' | 'income';
  paymentType: string;
  description: string;
  amount: number;
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === 'income'
                    ? 'bg-green-100'
                    : 'bg-red-100'
                  }`}
              >
                {transaction.type === 'income' ? (
                  <ArrowUpCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowDownCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                    }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {transaction.paymentType}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
