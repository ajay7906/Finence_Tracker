# WealthWise – Personal Finance Tracker

WealthWise is a modern, full-stack personal finance tracker that helps you manage your income, expenses, and financial goals. It provides insightful analytics, beautiful charts, and a simple interface to keep your finances healthy and organized.

---

## ✨ Features

- **🔐 User Authentication:** Secure registration, login, and logout with JWT tokens
- **💰 Transaction Management:** Add, view, and delete income/expense transactions
- **📊 Analytics Dashboard:** Visualize income, expenses, balance, category breakdown, and monthly trends
- **📈 Interactive Charts:** Beautiful bar, pie, and line charts for financial insights using Chart.js
- **👥 Role-Based Access:** Supports different user roles (`admin`, `user`, `read-only`)
- **🛡️ Security Features:** Rate limiting, JWT authentication, and secure data handling
- **⚡ Performance:** Redis caching for fast analytics and transaction queries
- **📱 Responsive Design:** Modern UI built with TailwindCSS and React 19
- **🔄 Real-time Updates:** Live data updates and smooth user experience

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern hooks and features
- **Vite** - Fast build tool and development server
- **TailwindCSS 4** - Utility-first CSS framework
- **Chart.js** - Interactive charts and data visualization
- **React Router DOM 7** - Client-side routing
- **Axios** - HTTP client for API requests
- **JWT Decode** - Token handling and user session management

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **PostgreSQL** - Primary database (hosted on Supabase)
- **Redis** - In-memory data structure store for caching
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Rate Limiting** - API abuse prevention

### Infrastructure
- **Supabase** - PostgreSQL database hosting
- **Redis Cloud** - Redis caching service
- **Render** - Backend deployment platform

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (or Supabase account)
- **Redis** instance (or Redis Cloud account)

### Environment Setup

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (PostgreSQL/Supabase)
DB_HOST=your-supabase-host
DB_USER=your-supabase-user
DB_PASSWORD=your-supabase-password
DB_NAME=your-database-name
DB_PORT=5432
DB_CA=your-ssl-certificate

# Redis Configuration
REDIS_URL=your-redis-url
REDIS_PASSWORD=your-redis-password

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Installation & Setup

#### 1. Clone the repository

```bash
git clone https://github.com/Vikashjain2/wealthwise.git
cd wealthwise
```

#### 2. Backend Setup

```bash
cd backend
npm install
npm run server
```

The backend server will start on `http://localhost:3000`

#### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 📚 API Documentation

### Base URL
```
https://finence-tracker-2.onrender.com/api
```

### Authentication Endpoints

#### 🔐 Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

#### 🔑 Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 🚪 Logout User
```http
PUT /api/auth/logout
Authorization: Bearer <JWT_TOKEN>
```

### Transaction Endpoints

#### 📋 Get Transactions
```http
GET /api/transactions?page=1&limit=10&type=expense&category=Food
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- `page` - Page number for pagination
- `limit` - Number of transactions per page
- `category` - Filter by transaction category
- `type` - Filter by transaction type (income/expense)
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)

#### ➕ Add Transaction
```http
POST /api/transactions
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "amount": 1000,
  "category": "Salary",
  "type": "income",
  "date": "2024-06-01",
  "description": "June Salary"
}
```

#### 🗑️ Delete Transaction
```http
DELETE /api/transactions/:id
Authorization: Bearer <JWT_TOKEN>
```

### Analytics Endpoints

#### 📊 Get Financial Analytics
```http
GET /api/analytics
Authorization: Bearer <JWT_TOKEN>
```

**Response includes:**
- Summary (total income, expenses, balance)
- Category breakdown
- Monthly trends
- Spending patterns

---

## 🏗️ Project Structure

```
wealthwise/
├── backend/                 # Backend server
│   ├── config/            # Database and Redis configuration
│   ├── controllers/       # Business logic controllers
│   ├── middleware/        # Authentication and rate limiting
│   ├── routes/            # API route definitions
│   ├── swagger.yaml       # API documentation
│   └── index.js           # Server entry point
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── pages/         # Application pages
│   │   └── App.jsx        # Main application component
│   └── package.json
└── README.md
```

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Rate Limiting** - Prevents API abuse and brute force attacks
- **CORS Protection** - Restricted to authorized origins
- **Helmet Security** - HTTP header security middleware
- **XSS Protection** - Cross-site scripting prevention
- **SSL/TLS** - Secure database connections

---

## 📱 Frontend Features

### Pages
- **Login/Register** - User authentication
- **Dashboard** - Financial overview with charts
- **Transactions** - Transaction management and history

### Components
- **TransactionForm** - Add/edit transaction form
- **TransactionList** - Paginated transaction display
- **CategoryPieChart** - Expense category breakdown
- **IncomeExpenseBarChart** - Monthly income vs expenses
- **TrendLineChart** - Financial trends over time

---

## 🚀 Deployment

### Backend (Render)
- Automatic deployment from GitHub
- Environment variables configured in Render dashboard
- PostgreSQL database connection via Supabase
- Redis caching via Redis Cloud

### Frontend (Vercel/Netlify)
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables for API endpoints

---

## 🧪 Development

### Available Scripts

**Backend:**
```bash
npm run server    # Start development server with nodemon
npm start         # Start production server
```

**Frontend:**
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Vikash Jain**
- GitHub: [@Vikashjain2](https://github.com/Vikashjain2)
- Project: [WealthWise Finance Tracker](https://github.com/Vikashjain2/wealthwise)

---

## 🙏 Acknowledgments

- **Chart.js** for beautiful data visualization
- **TailwindCSS** for modern UI components
- **Supabase** for reliable PostgreSQL hosting
- **Redis** for fast caching solutions

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Vikashjain2/wealthwise/issues) page
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

---

**Happy Financial Tracking! 💰📊**