import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const defaultCategories = [
      {
        name: 'Shop Raw Material',
        type: 'expense',
        icon: 'Package',
        color: '#f59e0b',
        isDefault: true,
      },
      {
        name: 'Electricity Bills',
        type: 'expense',
        icon: 'Zap',
        color: '#eab308',
        isDefault: true,
      },
      {
        name: 'Personal Spending',
        type: 'expense',
        icon: 'User',
        color: '#8b5cf6',
        isDefault: true,
      },
      {
        name: 'Home Spending from Shop',
        type: 'expense',
        icon: 'Home',
        color: '#ec4899',
        isDefault: true,
      },
      {
        name: 'Other Expenses',
        type: 'expense',
        icon: 'MoreHorizontal',
        color: '#6b7280',
        isDefault: true,
      },
      {
        name: 'Shop Earnings',
        type: 'income',
        icon: 'TrendingUp',
        color: '#10b981',
        isDefault: true,
      },
    ];

    // Check if categories already exist
    const existingCategories = await Category.find({ isDefault: true });

    if (existingCategories.length === 0) {
      await Category.insertMany(defaultCategories);
      return NextResponse.json({
        success: true,
        message: 'Default categories initialized successfully',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Default categories already exist',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
