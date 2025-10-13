import mongoose, { Schema, model, models } from 'mongoose';

export interface ITransaction {
  _id?: string;
  date: Date;
  category: string;
  type: 'expense' | 'income';
  paymentType: 'cash' | 'upi' | 'bank';
  description: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['cash', 'upi', 'bank'],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ type: 1 });

const Transaction = models.Transaction || model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
