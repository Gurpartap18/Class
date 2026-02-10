# Quick Start Guide

Get the Stock Monitoring App running in 5 minutes!

## Prerequisites Checklist
- [ ] Node.js installed (v14+)
- [ ] PostgreSQL installed and running
- [ ] Alpha Vantage API key (get free at https://www.alphavantage.co/support/#api-key)

## Step-by-Step Setup

### 1. Database Setup (2 minutes)
```bash
# Create database
createdb stock_monitor

# Run schema
psql -d stock_monitor -f database/schema.sql
```

### 2. Environment Configuration (1 minute)
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your settings:
# - Database password
# - JWT secret (any random string)
# - Alpha Vantage API key
```

Minimum required configuration:
```env
DB_PASSWORD=your_postgres_password
JWT_SECRET=any_random_secret_string
ALPHA_VANTAGE_API_KEY=your_api_key
```

### 3. Install Dependencies (1 minute)
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 4. Start the App (1 minute)
```bash
# Option 1: Run both frontend and backend together
npm run dev:full

# Option 2: Run separately in different terminals
# Terminal 1:
npm run dev

# Terminal 2:
npm run client
```

### 5. Access the App
Open your browser and go to: http://localhost:3000

## First Time User Flow

1. **Register an Account**
   - Click "Register"
   - Enter email and password
   - Click "Register"

2. **Create Your First Watchlist**
   - Click "+ Create Watchlist"
   - Name it (e.g., "My Tech Stocks")
   - Choose duration (e.g., "2 Weeks")
   - Click "Create Watchlist"

3. **Add Stocks**
   - Click on your watchlist
   - Click "+ Add Stock"
   - Enter ticker symbol (e.g., "AAPL")
   - Optionally enter shares owned
   - Click "Add Stock"
   - Repeat for up to 10 stocks

4. **Monitor Your Stocks**
   - View real-time prices
   - See performance since monitoring started
   - Click stocks to expand details
   - Check back daily for updates

## Tips

- **Free API Limits**: Alpha Vantage free tier allows 5 calls/minute
- **Stock Updates**: Prices update automatically every 15 minutes
- **Sample Tickers**: Try AAPL, MSFT, GOOGL, TSLA, AMZN
- **Email Alerts**: Configure email settings in .env to enable notifications

## Troubleshooting

**Database connection error?**
- Check PostgreSQL is running: `psql -l`
- Verify credentials in .env file

**API key not working?**
- Get a free key at: https://www.alphavantage.co/support/#api-key
- Check it's correctly set in .env file

**Port already in use?**
- Change PORT in .env (default: 5000)
- Or kill the process using the port

**Frontend won't start?**
- Make sure you're in the frontend directory: `cd frontend && npm install`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in .env
2. Build frontend: `npm run build`
3. Use a process manager like PM2: `pm2 start backend/server.js`
4. Set up NGINX as reverse proxy
5. Configure PostgreSQL for production
6. Use environment-specific .env files

## Need Help?

- Check the full README.md for detailed documentation
- Review API documentation in README.md
- Check console logs for errors
- Open an issue on GitHub

## Success Checklist

- [ ] Database created and schema loaded
- [ ] .env file configured with API key
- [ ] Dependencies installed
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Able to register and login
- [ ] Created first watchlist
- [ ] Added stocks and seeing price data

Congratulations! Your Stock Monitoring App is now running! 🎉
