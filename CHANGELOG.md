# Changelog

All notable changes to the Stock Monitoring App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added - MVP Release
- **User Authentication**
  - User registration with email and password
  - Secure login with JWT tokens
  - Password hashing with bcrypt
  - Token-based session management

- **Watchlist Management**
  - Create custom watchlists with names
  - Set monitoring periods (1 week, 2 weeks, 1 month)
  - Add up to 10 stocks per watchlist
  - Remove stocks from watchlist
  - Delete entire watchlists
  - View all watchlists on dashboard

- **Stock Monitoring**
  - Real-time stock price tracking
  - Integration with Alpha Vantage API
  - Current price, change, and percent change display
  - Historical price data storage
  - Performance tracking since start date
  - Daily high/low prices
  - Trading volume data
  - Portfolio value calculation (with shares owned)

- **Stock Dashboard**
  - Clean card-based UI
  - Color-coded gains (green) and losses (red)
  - Expandable stock cards with detailed metrics
  - Auto-refresh every 5 minutes
  - Responsive design

- **Alert System**
  - Create price target alerts
  - Set alert conditions (above/below threshold)
  - Automated alert checking every 5 minutes
  - Email notifications when alerts trigger
  - View and manage all alerts

- **Performance Reports**
  - Generate end-of-period reports
  - Overall watchlist performance summary
  - Individual stock performance metrics
  - Best/worst performer identification
  - Portfolio change calculations
  - Historical report archive

- **Background Services**
  - Stock data fetcher (runs every 15 minutes)
  - Alert checker (runs every 5 minutes)
  - Automated email notifications
  - Smart caching to respect API limits

- **Documentation**
  - Comprehensive README with setup instructions
  - Detailed API documentation
  - Quick start guide
  - Contributing guidelines
  - Database schema documentation

### Technical Features
- PostgreSQL database with optimized indexes
- RESTful API architecture
- JWT authentication middleware
- Request/response caching
- Error handling and validation
- Rate limiting for API calls
- CORS configuration
- Environment-based configuration

### Security
- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention
- Input validation and sanitization
- Secure environment variable handling

## [Unreleased]

### Planned for v1.1.0
- [ ] Stock price charts with Chart.js
- [ ] Multiple watchlists per user
- [ ] Advanced alert types (percent change, volume spikes)
- [ ] Export reports as PDF
- [ ] Dark mode UI theme
- [ ] Mobile responsive improvements

### Planned for v2.0.0
- [ ] News integration for stocks
- [ ] Social sharing features
- [ ] Portfolio tracking with trades
- [ ] Backtesting capabilities
- [ ] AI-powered insights
- [ ] Real-time WebSocket updates
- [ ] Mobile app (React Native)

---

## Version History

- **1.0.0** - Initial MVP release with core features
