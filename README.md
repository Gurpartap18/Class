# 📈 Stock Monitoring App

A comprehensive stock monitoring application that allows users to track and monitor stocks over custom time periods (1-2 weeks or longer) with automated alerts, performance analysis, and insights.

## Features

### ✅ MVP Features (Version 1.0)
- **User Authentication**: Secure sign up and login system
- **Watchlist Management**: Create and manage stock watchlists (up to 10 stocks per watchlist)
- **Monitoring Periods**: Track stocks for 1 week, 2 weeks, or 1 month
- **Real-time Price Tracking**: Automatic price updates and percent change calculations
- **Stock Dashboard**: Clean card-based UI showing monitored stocks
- **Price Target Alerts**: Get notified when stocks reach your target price
- **Daily Summary**: Email notifications with daily stock performance
- **Performance Reports**: End-of-period reports with detailed analytics
- **Historical Data**: View price history and track performance over time

### 🎯 Planned Features (Phase 2)
- Multiple watchlists support
- Advanced alert types (volume spikes, percent changes)
- Social sharing capabilities
- Portfolio tracking with actual trades
- Backtesting capabilities
- AI-powered insights and recommendations
- News integration
- Advanced charting with candlestick views

## Tech Stack

### Backend
- **Node.js** with Express
- **PostgreSQL** for database
- **JWT** for authentication
- **Alpha Vantage API** for stock data
- **Node-cron** for scheduled tasks
- **Nodemailer** for email notifications

### Frontend
- **React** 18.x
- **React Router** for navigation
- **Axios** for API calls
- **Chart.js** for data visualization
- **CSS3** for styling

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Gurpartap18/Class.git
cd Class
```

### 2. Database Setup

Create a PostgreSQL database:
```bash
createdb stock_monitor
```

Run the database schema:
```bash
psql -d stock_monitor -f database/schema.sql
```

### 3. Backend Setup

Install backend dependencies:
```bash
npm install
```

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and configure your settings:
```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stock_monitor
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_key_here

# Alpha Vantage API Key
# Get free key from: https://www.alphavantage.co/support/#api-key
ALPHA_VANTAGE_API_KEY=your_api_key_here

# Email Configuration (optional, for alerts)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

FRONTEND_URL=http://localhost:3000
```

### 4. Frontend Setup

Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
cd ..
```

### 5. Get Alpha Vantage API Key

1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Register for a free API key
3. Add the API key to your `.env` file

**Note**: Free tier has rate limits (5 API calls per minute, 500 calls per day)

## Running the Application

### Development Mode

Start the backend server (from root directory):
```bash
npm run dev
```

In a new terminal, start the frontend (from root directory):
```bash
npm run client
```

Or run both concurrently:
```bash
npm run dev:full
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Mode

Build the frontend:
```bash
npm run build
```

Start the backend:
```bash
npm start
```

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: { email, password }
```

#### Login User
```
POST /api/auth/login
Body: { email, password }
Returns: { user, token }
```

### Watchlist Endpoints

All watchlist endpoints require authentication (Bearer token).

#### Get All Watchlists
```
GET /api/watchlist
Headers: Authorization: Bearer <token>
```

#### Get Watchlist Details
```
GET /api/watchlist/:id
Headers: Authorization: Bearer <token>
```

#### Create Watchlist
```
POST /api/watchlist
Headers: Authorization: Bearer <token>
Body: { name, startDate, endDate }
```

#### Add Stock to Watchlist
```
POST /api/watchlist/:id/stocks
Headers: Authorization: Bearer <token>
Body: { ticker, sharesOwned, entryPrice }
```

#### Remove Stock from Watchlist
```
DELETE /api/watchlist/:id/stocks/:stockId
Headers: Authorization: Bearer <token>
```

#### Delete Watchlist
```
DELETE /api/watchlist/:id
Headers: Authorization: Bearer <token>
```

### Stock Endpoints

#### Get Stock Quote
```
GET /api/stock/quote/:ticker
Headers: Authorization: Bearer <token>
```

#### Get Stock History
```
GET /api/stock/history/:ticker?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Headers: Authorization: Bearer <token>
```

#### Get Stock Performance
```
GET /api/stock/performance/:ticker?startDate=YYYY-MM-DD
Headers: Authorization: Bearer <token>
```

### Alert Endpoints

#### Get All Alerts
```
GET /api/alert
Headers: Authorization: Bearer <token>
```

#### Create Alert
```
POST /api/alert
Headers: Authorization: Bearer <token>
Body: { ticker, watchlistId, alertType, thresholdValue, condition }
```

#### Delete Alert
```
DELETE /api/alert/:id
Headers: Authorization: Bearer <token>
```

### Report Endpoints

#### Generate Report
```
POST /api/report/generate/:watchlistId
Headers: Authorization: Bearer <token>
```

#### Get Watchlist Reports
```
GET /api/report/watchlist/:watchlistId
Headers: Authorization: Bearer <token>
```

#### Get Specific Report
```
GET /api/report/:id
Headers: Authorization: Bearer <token>
```

## Database Schema

The application uses the following main tables:
- **users**: User authentication data
- **watchlists**: User-created watchlists
- **watchlist_stocks**: Stocks in each watchlist
- **price_data**: Historical stock price data
- **alerts**: User-defined price alerts
- **reports**: Generated performance reports

See `database/schema.sql` for complete schema details.

## Background Services

The application runs two background services:

1. **Stock Data Fetcher**: Runs every 15 minutes to fetch current prices for all monitored stocks
2. **Alert Checker**: Runs every 5 minutes to check alert conditions and send notifications

## User Guide

### Getting Started

1. **Register an Account**
   - Navigate to the registration page
   - Enter your email and password
   - Click "Register"

2. **Create Your First Watchlist**
   - Click "Create Watchlist" on the dashboard
   - Enter a name (e.g., "Tech Stocks Watch")
   - Select monitoring duration (1 week, 2 weeks, or 1 month)
   - Click "Create"

3. **Add Stocks to Watchlist**
   - Click on your watchlist
   - Click "Add Stock"
   - Enter the ticker symbol (e.g., AAPL, TSLA, MSFT)
   - Optionally enter number of shares owned
   - Click "Add Stock"

4. **Monitor Your Stocks**
   - View real-time price updates
   - See daily changes and overall performance
   - Click on stock cards to expand for more details

5. **Set Up Alerts** (Coming in Phase 2)
   - Configure price target alerts
   - Get email notifications when conditions are met

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if the database exists: `psql -l`

### API Rate Limit Errors
- Alpha Vantage free tier: 5 calls/minute, 500 calls/day
- Consider upgrading to premium tier for production use
- Implement caching (already included in the app)

### Email Notifications Not Working
- Verify email configuration in `.env`
- For Gmail, enable "Less secure app access" or use App Passwords
- Check spam/junk folders

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Environment variables for sensitive data
- API rate limiting implemented
- Input validation on all endpoints
- CORS configured for frontend access

## Legal Disclaimer

This application is for informational and educational purposes only. It is not financial advice. Stock market data may be delayed or inaccurate. Always consult with a qualified financial advisor before making investment decisions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Roadmap

- [x] User authentication
- [x] Watchlist management
- [x] Stock price tracking
- [x] Basic alerts
- [x] Performance reports
- [ ] Multiple watchlists
- [ ] Advanced charting
- [ ] News integration
- [ ] Social features
- [ ] Mobile app
- [ ] AI-powered insights

## Acknowledgments

- Stock data provided by [Alpha Vantage](https://www.alphavantage.co/)
- Built with React and Node.js
- Database: PostgreSQL