# MongoDB Setup Guide for Shop Finance App

## Option 1: MongoDB Atlas (Cloud - Recommended for Beginners) ☁️

### Step 1: Create Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with email or Google account
3. Verify your email

### Step 2: Create a Cluster
1. Click **"Build a Database"**
2. Choose **"FREE"** (M0 Sandbox)
3. Select a cloud provider (AWS recommended)
4. Choose region closest to you
5. Cluster name: `shop-finance-cluster` (or any name)
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `shopuser` (or your choice)
5. Password: Create a strong password (SAVE THIS!)
6. User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist IP Address
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Options:
   - **For Development**: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - **For Production**: Add your specific IP
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Click **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string

### Step 6: Configure Your App
1. Open `d:\Downloads\shop\.env.local`
2. Replace the connection string:
```env
MONGODB_URI=mongodb+srv://shopuser:<password>@shop-finance-cluster.xxxxx.mongodb.net/shop-finance?retryWrites=true&w=majority
```
3. Replace `<password>` with your actual password
4. Replace `xxxxx` with your cluster ID (from the connection string)

### Example Connection String
```
MONGODB_URI=mongodb+srv://shopuser:MySecureP@ss123@shop-finance-cluster.abc123.mongodb.net/shop-finance?retryWrites=true&w=majority
```

---

## Option 2: Local MongoDB Installation (Windows) 💻

### Step 1: Download MongoDB
1. Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Select:
   - Version: Latest (7.0+)
   - Platform: Windows
   - Package: MSI
3. Click **"Download"**

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose **"Complete"** installation
3. Install as a **Windows Service** ✓
4. Install **MongoDB Compass** (GUI tool) ✓
5. Complete the installation

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
mongod --version
```

You should see MongoDB version information.

### Step 4: Create Data Directory
```powershell
# Create directory for MongoDB data
New-Item -ItemType Directory -Path "C:\data\db" -Force
```

### Step 5: Start MongoDB Service
```powershell
# Run PowerShell as Administrator
net start MongoDB
```

### Step 6: Verify MongoDB is Running
```powershell
# Connect to MongoDB
mongosh
```

You should see MongoDB shell prompt: `test>`

Type `exit` to quit.

### Step 7: Configure Your App
Your `.env.local` should already have:
```env
MONGODB_URI=mongodb://localhost:27017/shop-finance
```

No changes needed!

---

## Testing Your Connection

### Method 1: Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connection string:
   - **Atlas**: Use your Atlas connection string
   - **Local**: `mongodb://localhost:27017`
3. Click **"Connect"**
4. You should see your databases

### Method 2: Using Your App
1. Start your app: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Click **"Add Entry"**
4. If page loads without errors, connection is working! ✅

### Method 3: Test API Endpoint
Open browser and visit:
```
http://localhost:3000/api/init
```

Should see: `{"success":true,"message":"Default categories initialized successfully"}`

---

## Common Issues & Solutions

### Issue 1: "MongoNetworkError"
**Cause**: Cannot connect to MongoDB

**Solutions**:
- **Atlas**: Check internet connection and IP whitelist
- **Local**: Make sure MongoDB service is running
  ```powershell
  net start MongoDB
  ```

### Issue 2: "Authentication failed"
**Cause**: Wrong username or password

**Solutions**:
- Check `.env.local` for typos
- Verify password in MongoDB Atlas dashboard
- Make sure password is URL-encoded (no special characters or encode them)

### Issue 3: "Cannot find module 'mongodb'"
**Cause**: Dependencies not installed

**Solution**:
```powershell
npm install
```

### Issue 4: MongoDB service won't start (Local)
**Solutions**:
```powershell
# Stop the service
net stop MongoDB

# Remove lock file
Remove-Item "C:\data\db\mongod.lock" -Force

# Restart service
net start MongoDB
```

### Issue 5: Port 27017 already in use
**Solution**:
```powershell
# Find process using port 27017
netstat -ano | findstr :27017

# Kill the process (use PID from above)
taskkill /PID <PID> /F

# Restart MongoDB
net start MongoDB
```

---

## MongoDB Commands Reference

### Start/Stop MongoDB Service (Local)
```powershell
# Start
net start MongoDB

# Stop
net stop MongoDB

# Restart
net stop MongoDB; net start MongoDB
```

### Connect to MongoDB Shell
```powershell
mongosh
```

### Useful MongoDB Shell Commands
```javascript
// Show all databases
show dbs

// Use shop-finance database
use shop-finance

// Show all collections
show collections

// View all transactions
db.transactions.find()

// View all categories
db.categories.find()

// Count transactions
db.transactions.countDocuments()

// Delete all transactions (BE CAREFUL!)
db.transactions.deleteMany({})

// Delete all categories
db.categories.deleteMany({})

// Drop entire database (BE VERY CAREFUL!)
db.dropDatabase()

// Exit
exit
```

---

## Which Option Should You Choose?

### Choose MongoDB Atlas (Cloud) if:
✅ You want easy setup
✅ You want automatic backups
✅ You want to access from multiple devices
✅ You don't want to manage local service
✅ You're deploying to production

### Choose Local MongoDB if:
✅ You want full control
✅ You work offline frequently
✅ You have privacy concerns
✅ You're comfortable with server management
✅ You're only developing locally

---

## Security Best Practices

### For MongoDB Atlas:
1. ✅ Use strong passwords
2. ✅ Whitelist only necessary IPs
3. ✅ Enable 2FA on Atlas account
4. ✅ Rotate passwords regularly
5. ✅ Use environment variables (never commit `.env.local`)

### For Local MongoDB:
1. ✅ Enable authentication
2. ✅ Use firewall rules
3. ✅ Regular backups
4. ✅ Keep MongoDB updated
5. ✅ Don't expose port 27017 to internet

---

## Backup Your Data

### MongoDB Atlas:
- Automatic backups included in free tier
- Can also export using MongoDB Compass

### Local MongoDB:
```powershell
# Export database
mongodump --db shop-finance --out "C:\backups\mongodb"

# Import database
mongorestore --db shop-finance "C:\backups\mongodb\shop-finance"
```

---

## Next Steps

Once MongoDB is set up:
1. ✅ Verify connection is working
2. ✅ Start the app: `npm run dev`
3. ✅ Open: `http://localhost:3000`
4. ✅ Add your first transaction!

---

**Need Help?**
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Community: https://www.mongodb.com/community/forums/
- Local MongoDB Docs: https://docs.mongodb.com/manual/

**You're ready to go! 🚀**
