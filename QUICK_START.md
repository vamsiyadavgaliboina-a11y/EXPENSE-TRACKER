# ⚡ Quick Start Guide

Get the Expense Tracker application running in 5 minutes!

## 🚀 Super Quick Start (For Impatient People)

### 1. Prerequisites
```bash
# Install Node.js from https://nodejs.org (v16+)
node --version  # Check version
```

### 2. Clone & Install
```bash
cd expense-tracker
npm run install:all
```

### 3. Configure Environment
```bash
# Server configuration
cd server
cp .env.example .env
# Edit .env and fill in:
# - MONGO_URI (use MongoDB Atlas free tier)
# - JWT_SECRET (any random string)
# - GROQ_API_KEY (from https://console.groq.com - FREE)
# - CLIENT_URL=http://localhost:5173

# Client configuration  
cd ../client
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Get Groq API Key (2 minutes)
1. Go to https://console.groq.com
2. Sign up (free)
3. Click "API Keys" → "Create New API Key"
4. Copy and paste into `server/.env`

### 5. Get MongoDB (2 options)

**Option A: Quick Cloud (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create a cluster (free tier available)
4. Click "Connect"
5. Choose "Drivers" → Copy connection string
6. Add to `server/.env` as `MONGO_URI`

**Option B: Local**
```bash
# Download from https://www.mongodb.com/try/download/community
# Or use Homebrew/Chocolatey
brew install mongodb  # macOS
choco install mongodb # Windows
```

### 6. Run Everything
```bash
# From root directory
npm run dev
```

**That's it!** 🎉
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 📚 What to Do First

### Test the App
1. Register a new account
2. Go to Dashboard - you'll see empty cards
3. Add an expense (Expenses page)
4. Add income (Income page)
5. Set a budget (Budget page)
6. Check Analytics to see charts
7. Click "AI Insights" for AI recommendations
8. Check Forecast to see spending projections

### Demo Data Flow
1. **Landing Page** → "Get Started" → Register
2. **Login** → Enter credentials
3. **Dashboard** → Hover over cards to see info
4. **Expenses** → Click "Add Expense" button
5. **AI Insights** → Click "Spending Analysis" button

## 🛠️ Useful Commands

```bash
# Development
npm run dev:server      # Backend only
npm run dev:client      # Frontend only
npm run dev             # Both (from root)

# Production build
npm run build:client    # Build frontend
npm run build:server    # Build backend

# Reset everything
rm -rf node_modules server/node_modules client/node_modules
npm run install:all
```

## 📱 Test Credentials

After registration, you can log in with your created account.

## 🐛 Common Issues & Fixes

### "Cannot connect to MongoDB"
- Check MONGO_URI in server/.env
- Verify MongoDB is running (local) or check IP whitelist (Atlas)
- Test connection with: `mongo "your_connection_string"`

### "Groq API Error"
- Double-check API key is correct
- Visit https://console.groq.com to verify key exists
- Check network connectivity

### "CORS Error"
- Verify CLIENT_URL in server/.env matches frontend URL
- Backend should be: http://localhost:5000
- Frontend should be: http://localhost:5173

### "Port 5000/5173 already in use"
```bash
# Kill process using port 5000
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process using port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### "npm run dev command not found"
- Ensure you're in the root directory (`expense-tracker`)
- Run `npm install` first
- Then `npm run install:all`

## 🎯 Next Steps

1. **Customize** - Modify colors, fonts in `client/tailwind.config.js`
2. **Add Features** - Follow the existing code patterns
3. **Deploy** - See README.md for deployment guides
4. **Optimize** - Monitor performance, add caching

## 📖 Full Documentation

See **README.md** for:
- Complete API documentation
- Database schema details
- Feature explanations
- Deployment guides
- Architecture details

## ✅ Quick Verification Checklist

After starting the app:
- [ ] Frontend loads at http://localhost:5173
- [ ] Can register new account
- [ ] Can login
- [ ] Dashboard shows summary cards
- [ ] Can add an expense
- [ ] Analytics page shows charts
- [ ] AI Insights button is clickable
- [ ] Settings page loads
- [ ] Can toggle dark mode

## 🆘 Need Help?

1. Check console errors (press F12 in browser)
2. Check terminal output for backend errors
3. Verify all environment variables are set
4. Check MongoDB connection
5. Check Groq API key is valid

---

**You're all set! Happy budgeting!** 💰✨
