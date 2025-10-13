# Shop Finance Management App

A full-stack finance management web application built with Next.js 14, TypeScript, Tailwind CSS, and MongoDB to manage and track all financial activities of your shop.

## Features

✅ **Expense Categories Management**
- Shop Raw Material Expenses
- Electricity Bills
- Personal Spending
- Home Spending from Shop Earnings
- Custom categories

✅ **Daily Income Tracking**
- Add daily earnings
- Maintain income history by date

✅ **Finance Entry Form**
- Beautiful and clean form UI
- Date, Category, Payment Type (Cash/UPI/Bank)
- Description and Amount fields

✅ **Comprehensive Dashboard**
- Total Shop Expenses
- Total Personal Contributions
- Total Home Usage from Shop
- Total Earnings
- Net Profit/Loss
- Monthly statistics
- Latest transactions list
- Charts and graphs for insights

✅ **Pages**
- Dashboard with statistics and charts
- Add Finance Entry form
- All Transactions (with filters)
- Expense Categories Management
- Reports Page with analytics

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Date Handling**: date-fns

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd d:\Downloads\shop
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   
   The `.env.local` file has been created. Update it with your MongoDB connection string:

   **For Local MongoDB**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/shop-finance
   ```

   **For MongoDB Atlas**:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shop-finance?retryWrites=true&w=majority
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   ```
3. Use the local connection string in `.env.local`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update `.env.local`

## First-Time Setup

When you first run the application:

1. Navigate to the **Add Entry** page
2. The app will automatically initialize default categories:
   - Shop Raw Material
   - Electricity Bills
   - Personal Spending
   - Home Spending from Shop
   - Other Expenses
   - Shop Earnings

3. Start adding your first transaction!

## Project Structure

```
shop/
├── app/
│   ├── api/              # API routes
│   │   ├── categories/   # Category CRUD operations
│   │   ├── transactions/ # Transaction CRUD operations
│   │   ├── stats/        # Statistics endpoint
│   │   └── init/         # Initialize default data
│   ├── add/              # Add transaction page
│   ├── transactions/     # All transactions page
│   ├── categories/       # Categories management page
│   ├── reports/          # Reports and analytics page
│   ├── layout.tsx        # Root layout with sidebar
│   ├── page.tsx          # Dashboard (home page)
│   └── globals.css       # Global styles
├── components/           # Reusable React components
│   ├── Sidebar.tsx
│   ├── StatCard.tsx
│   ├── RecentTransactions.tsx
│   └── ChartSection.tsx
├── lib/
│   └── mongodb.ts        # MongoDB connection utility
├── models/               # Mongoose schemas
│   ├── Category.ts
│   └── Transaction.ts
├── public/               # Static assets
├── .env.local            # Environment variables
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── next.config.js        # Next.js configuration
```

## Available Scripts

```bash
# Development
npm run dev        # Start development server

# Production
npm run build      # Build for production
npm start          # Start production server

# Linting
npm run lint       # Run ESLint
```

## Usage Guide

### Adding a Transaction

1. Click on **Add Entry** in the sidebar
2. Select the date
3. Choose transaction type (Expense or Income)
4. Select a category
5. Choose payment method (Cash, UPI, or Bank)
6. Enter description and amount
7. Click **Save Transaction**

### Viewing Transactions

1. Click on **Transactions** in the sidebar
2. Use filters to search by:
   - Type (Income/Expense)
   - Category
   - Date range
3. Delete transactions using the trash icon

### Managing Categories

1. Click on **Categories** in the sidebar
2. Click **Add Category** to create new categories
3. Delete custom categories (default categories cannot be deleted)

### Viewing Reports

1. Click on **Reports** in the sidebar
2. Switch between Today, This Month, or All Time
3. View charts showing:
   - Income vs Expenses
   - Payment method distribution
   - Financial overview

### Dashboard Features

1. View key metrics:
   - Total Income
   - Total Expenses
   - Net Profit/Loss
   - Transaction count
2. See expense breakdown by category
3. View recent transactions
4. Analyze financial trends with charts

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions (with filters)
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/[id]` - Get transaction by ID
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `DELETE /api/categories/[id]` - Delete category
- `PUT /api/categories/[id]` - Update category

### Statistics
- `GET /api/stats?period=month` - Get financial statistics

### Initialization
- `POST /api/init` - Initialize default categories

## Customization

### Colors
Edit `tailwind.config.ts` to customize the color scheme:
```typescript
colors: {
  primary: {
    500: '#0ea5e9',
    600: '#0284c7',
    // ... more shades
  }
}
```

### Categories
Add or modify default categories in `app/api/init/route.ts`

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your connection string in `.env.local`
- For Atlas, verify IP whitelist and database user credentials

### TypeScript Errors
- Run `npm install` to ensure all dependencies are installed
- The errors shown during development are expected until dependencies are installed

### Port Already in Use
- Change the port: `npm run dev -- -p 3001`

## Security Considerations

For production deployment:
1. Use environment variables for sensitive data
2. Implement authentication (NextAuth.js recommended)
3. Add input validation and sanitization
4. Use HTTPS
5. Implement rate limiting
6. Regular security updates

## Future Enhancements

Potential features to add:
- User authentication and multi-user support
- PDF export of reports
- Email notifications for low balance
- Recurring transactions
- Budget planning
- Mobile responsive improvements
- Dark mode
- Multi-currency support

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available for personal and commercial use.

## Support

For issues and questions, please create an issue in the repository or contact the developer.

---

**Built with ❤️ for efficient shop finance management**
