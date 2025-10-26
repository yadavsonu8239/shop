import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month'; // month, today, all, custom
    const customDate = searchParams.get('date'); // Custom date for specific day

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (period === 'custom' && customDate) {
      // Custom date - show stats for specific day
      startDate = startOfDay(new Date(customDate));
      endDate = endOfDay(new Date(customDate));
    } else if (period === 'month') {
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
    } else if (period === 'today') {
      startDate = startOfDay(new Date());
      endDate = endOfDay(new Date());
    }

    let query: any = {};
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await Transaction.find(query);

    // Calculate statistics
    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      shopEarnings: 0,
      shopRawMaterial: 0,
      electricityBills: 0,
      personalSpending: 0,
      homeSpending: 0,
      otherExpenses: 0,
      cashTotal: 0,
      upiTotal: 0,
      bankTotal: 0,
      netProfit: 0,
      transactionCount: transactions.length,
    };

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        stats.totalIncome += transaction.amount;
        
        // Track Shop Earnings specifically
        const category = transaction.category.toLowerCase();
        if (category.includes('shop earnings') || category.includes('shop earning')) {
          stats.shopEarnings += transaction.amount;
        }
      } else {
        stats.totalExpenses += transaction.amount;

        // Category-wise breakdown
        const category = transaction.category.toLowerCase();
        if (category.includes('raw material')) {
          stats.shopRawMaterial += transaction.amount;
        } else if (category.includes('electricity')) {
          stats.electricityBills += transaction.amount;
        } else if (category.includes('personal')) {
          stats.personalSpending += transaction.amount;
        } else if (category.includes('home')) {
          stats.homeSpending += transaction.amount;
        } else {
          stats.otherExpenses += transaction.amount;
        }
      }

      // Payment type breakdown
      if (transaction.paymentType === 'cash') {
        stats.cashTotal += transaction.amount;
      } else if (transaction.paymentType === 'upi') {
        stats.upiTotal += transaction.amount;
      } else if (transaction.paymentType === 'bank') {
        stats.bankTotal += transaction.amount;
      }
    });

    stats.netProfit = stats.totalIncome - stats.totalExpenses;

    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
