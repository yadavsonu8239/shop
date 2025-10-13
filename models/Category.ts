import mongoose, { Schema, model, models } from 'mongoose';

export interface ICategory {
  _id?: string;
  name: string;
  type: 'expense' | 'income';
  icon?: string;
  color?: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      required: true,
    },
    icon: {
      type: String,
      default: 'Circle',
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model<ICategory>('Category', CategorySchema);

export default Category;
