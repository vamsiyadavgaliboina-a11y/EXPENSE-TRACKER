# 💰 Expense Tracker - AI-Assisted Student Budgeting

An intelligent, full-stack web application that helps students manage their finances effectively with AI-powered spending insights, budget forecasting, and interactive analytics.

## 📌 Project Overview

**Expense Tracker** is a comprehensive financial management tool designed specifically for students. It enables users to:

- ✅ Track income and expenses with detailed categorization
- ✅ Set monthly budgets and receive real-time alerts
- ✅ Visualize spending patterns through interactive charts
- ✅ Get AI-powered financial insights and recommendations
- ✅ Forecast future spending based on historical data
- ✅ Monitor budget status and optimize spending habits

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Groq API** - AI integration

### AI Integration
- **Groq API** with llama-3.3-70b-versatile model for intelligent financial analysis

## 📁 Project Structure

```
expense-tracker/
├── client/                          # React frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Cards.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── Budget.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Forecast.jsx
│   │   │   ├── AIInsights.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/                 # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── FinanceContext.jsx
│   │   ├── services/                # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── expenseService.js
│   │   │   ├── incomeService.js
│   │   │   ├── budgetService.js
│   │   │   ├── dashboardService.js
│   │   │   └── aiService.js
│   │   ├── utils/                   # Utility functions
│   │   │   ├── formatCurrency.js
│   │   │   ├── formatDate.js
│   │   │   └── constants.js
│   │   ├── hooks/                   # Custom hooks
│   │   │   └── useDebounce.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── server/                          # Node.js backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── expenseController.js
│   │   ├── incomeController.js
│   │   ├── budgetController.js
│   │   ├── dashboardController.js
│   │   ├── aiController.js
│   │   └── notificationController.js
│   ├── middleware/                  # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── validationMiddleware.js
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Expense.js
│   │   ├── Income.js
│   │   ├── Budget.js
│   │   └── Notification.js
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── aiRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/                    # Business services
│   │   ├── groqService.js           # AI integration
│   │   ├── forecastService.js       # Forecasting logic
│   │   └── notificationService.js
│   ├── utils/                       # Utility functions
│   │   ├── generateToken.js
│   │   └── calculations.js
│   ├── server.js                    # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── .gitignore
├── README.md
└── package.json
```

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  currency: String (default: '₹'),
  monthlyIncome: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense
```javascript
{
  userId: ObjectId,
  title: String,
  amount: Number,
  category: String (enum),
  description: String,
  paymentMethod: String,
  date: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Income
```javascript
{
  userId: ObjectId,
  source: String,
  amount: Number,
  category: String (enum),
  description: String,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Budget
```javascript
{
  userId: ObjectId,
  month: Number,
  year: Number,
  totalBudget: Number,
  categoryBudgets: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Notification
```javascript
{
  userId: ObjectId,
  title: String,
  message: String,
  type: String (enum: 'warning', 'critical', 'info', 'exceeded'),
  read: Boolean,
  createdAt: Date
}
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ bcryptjs password hashing
- ✅ Protected API routes
- ✅ Input validation & sanitization
- ✅ Rate limiting on auth endpoints
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ No sensitive data in frontend

## 📋 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
GET    /api/auth/me             - Get current user
```

### User Endpoints

```
GET    /api/user/profile        - Get user profile
PUT    /api/user/profile        - Update user profile
```

### Expense Endpoints

```
GET    /api/expenses            - Get all expenses (paginated)
POST   /api/expenses            - Create expense
GET    /api/expenses/:id        - Get expense by ID
PUT    /api/expenses/:id        - Update expense
DELETE /api/expenses/:id        - Delete expense
```

### Income Endpoints

```
GET    /api/income              - Get all income (paginated)
POST   /api/income              - Create income
GET    /api/income/:id          - Get income by ID
PUT    /api/income/:id          - Update income
DELETE /api/income/:id          - Delete income
```

### Budget Endpoints

```
GET    /api/budget              - Get budgets
POST   /api/budget              - Create budget
PUT    /api/budget/:id          - Update budget
DELETE /api/budget/:id          - Delete budget
```

### Dashboard Endpoints

```
GET    /api/dashboard/summary   - Get summary statistics
GET    /api/dashboard/analytics - Get analytics data
GET    /api/dashboard/forecast  - Get spending forecast
```

### AI Endpoints

```
POST   /api/ai/insights         - Get spending insights
POST   /api/ai/forecast-insights - Get forecast insights
```

### Notification Endpoints

```
GET    /api/notifications       - Get notifications
PUT    /api/notifications/:id/read - Mark as read
DELETE /api/notifications/:id   - Delete notification
```

## 🔧 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Groq API Key** (free at https://console.groq.com)

## 📥 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### Step 2: Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure .env with:
# - MONGO_URI (MongoDB connection string)
# - JWT_SECRET (any secure string)
# - GROQ_API_KEY (from Groq console)
# - CLIENT_URL (http://localhost:5173)

# Start backend server
npm run dev
```

### Step 3: Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# VITE_API_BASE_URL should be http://localhost:5000/api

# Start frontend development server
npm run dev
```

### Step 4: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB and start the service
mongod

# Default connection: mongodb://localhost:27017/expense-tracker
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Add to .env: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority`

### Step 5: Groq API Setup

1. Go to https://console.groq.com
2. Sign up for free account
3. Navigate to API Keys
4. Create new API key
5. Add to server/.env: `GROQ_API_KEY=your_api_key_here`

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

### Production Build

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

**Backend:**
```bash
cd server
npm start
```

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Vercel:**
   ```bash
   npm install -g vercel
   cd client
   vercel
   ```

2. **Netlify:**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

### Backend Deployment (Render/Railway)

**Render:**
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure environment variables
5. Set build command: `npm install`
6. Set start command: `npm start`

**Railway:**
1. Go to https://railway.app
2. Create new project
3. Connect GitHub
4. Set environment variables in dashboard
5. Deploy

### Database (MongoDB Atlas)

1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Add connection string to environment variables
3. Configure IP whitelist for server

## 🎯 Features & Capabilities

### ✅ Expense Management
- Add, edit, delete expenses
- Categorize spending
- Track payment methods
- Search and filter expenses
- Pagination support

### ✅ Income Tracking
- Record income from multiple sources
- Categorize income
- Track income history
- Monthly income dashboard

### ✅ Budget Management
- Create monthly budgets
- Set category-wise limits
- Track budget usage
- Budget alerts and warnings

### ✅ Analytics & Visualization
- Monthly spending trends (line charts)
- Category distribution (pie charts)
- Category breakdown details
- Spending comparisons

### ✅ Budget Forecasting
- Project monthly spending
- Calculate daily averages
- Compare with budget
- Forecast status indicators

### ✅ AI-Powered Insights
- Spending analysis and summary
- Trend identification
- Budget recommendations
- Practical financial suggestions
- Forecast interpretation

### ✅ Dashboard
- Summary cards (income, expenses, balance)
- Monthly statistics
- Recent transactions
- Budget status
- Average daily spending

### ✅ Notifications
- Budget alerts
- Spending warnings
- Forecast warnings
- Notification center

### ✅ User Features
- Secure registration/login
- Profile management
- Currency preferences
- Monthly income setup
- Dark/Light theme

## 🤖 AI Integration Details

The application uses **Groq API** with the **llama-3.3-70b-versatile** model to provide:

### Spending Analysis
- Summary of spending habits
- Identification of spending trends
- Budget risk assessment
- Category-wise observations
- Practical recommendations

### Forecast Interpretation
- Analysis of projected spending
- Comparison with budget
- Status indicators
- Actionable recommendations

**Note:** AI responses are JSON-formatted for consistency and are always educational, never professional financial advice.

## ✨ UI/UX Highlights

- **Glassmorphism Design** - Modern glass-effect cards
- **Smooth Animations** - Framer Motion transitions
- **Responsive Layout** - Mobile-first design
- **Dark Mode** - Full dark theme support
- **Accessibility** - WCAG compliant
- **Interactive Charts** - Recharts with tooltips
- **Loading States** - Skeleton loaders
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback

## 🧪 Testing Credentials

**Demo Account:**
- Email: `demo@example.com`
- Password: `demo123456`

*(These are placeholder credentials. Actual demo data should be set up in production)*

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running (local) or check connection string (Atlas)
- Verify network access in MongoDB Atlas
- Check MONGO_URI in .env

### Groq API Error
- Verify API key is correct
- Check if API quota is exceeded
- Ensure network connectivity

### Frontend-Backend Communication Error
- Verify VITE_API_BASE_URL is correct
- Check if backend server is running
- Clear browser cache and cookies

### Port Already in Use
- Backend (5000): `lsof -i :5000` and kill process
- Frontend (5173): `lsof -i :5173` and kill process

## 📈 Performance Optimization

- MongoDB indexes on frequently queried fields
- Pagination for large datasets
- Lazy loading on frontend
- Code splitting with React Router
- Minification and bundling with Vite
- Caching strategies for static assets
- Rate limiting to prevent abuse

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced budget customization
- [ ] Recurring expense templates
- [ ] Multiple currency support
- [ ] Bank account integration
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Social features (shared budgets)
- [ ] Investment tracking
- [ ] Savings goals

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support & Contact

- Create an issue on GitHub for bugs
- Provide detailed error messages and steps to reproduce
- Include environment details (OS, browser, versions)

## ✅ Project Checklist

- ✅ Complete backend server with all routes
- ✅ MongoDB models with proper schemas
- ✅ JWT authentication & security
- ✅ Groq AI integration
- ✅ Budget forecasting system
- ✅ Complete React frontend
- ✅ All pages and components
- ✅ Context API for state management
- ✅ API services for backend communication
- ✅ Responsive design with Tailwind CSS
- ✅ Dark/Light theme support
- ✅ Data visualization with Recharts
- ✅ Error handling and validation
- ✅ Loading states and animations
- ✅ Environment configuration
- ✅ This comprehensive README

---

**Built with ❤️ for students managing their finances**
#   E X P E N S E - T R A C K E R  
 