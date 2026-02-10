# Stock Monitoring App - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Auth Endpoints

### Register User
Creates a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response** (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (400):
```json
{
  "error": "User already exists"
}
```

---

### Login User
Authenticates a user and returns a JWT token.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response** (200):
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (401):
```json
{
  "error": "Invalid credentials"
}
```

---

## Watchlist Endpoints

### Get All Watchlists
Returns all watchlists for the authenticated user.

**Endpoint**: `GET /watchlist`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "watchlists": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Tech Stocks Watch",
      "start_date": "2024-01-01",
      "end_date": "2024-01-15",
      "status": "active",
      "stock_count": "5",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Watchlist Details
Returns a specific watchlist with all its stocks.

**Endpoint**: `GET /watchlist/:id`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "watchlist": {
    "id": 1,
    "user_id": 1,
    "name": "Tech Stocks Watch",
    "start_date": "2024-01-01",
    "end_date": "2024-01-15",
    "status": "active",
    "stocks": [
      {
        "id": 1,
        "watchlist_id": 1,
        "ticker": "AAPL",
        "shares_owned": 10.00,
        "entry_price": 150.00,
        "added_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Create Watchlist
Creates a new watchlist.

**Endpoint**: `POST /watchlist`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Tech Stocks Watch",
  "startDate": "2024-01-01",
  "endDate": "2024-01-15"
}
```

**Success Response** (201):
```json
{
  "message": "Watchlist created successfully",
  "watchlist": {
    "id": 1,
    "user_id": 1,
    "name": "Tech Stocks Watch",
    "start_date": "2024-01-01",
    "end_date": "2024-01-15",
    "status": "active"
  }
}
```

---

### Add Stock to Watchlist
Adds a stock to an existing watchlist (max 10 stocks).

**Endpoint**: `POST /watchlist/:id/stocks`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "ticker": "AAPL",
  "sharesOwned": 10,
  "entryPrice": 150.00
}
```

**Success Response** (201):
```json
{
  "message": "Stock added to watchlist",
  "stock": {
    "id": 1,
    "watchlist_id": 1,
    "ticker": "AAPL",
    "shares_owned": 10.00,
    "entry_price": 150.00
  }
}
```

**Error Response** (400):
```json
{
  "error": "Maximum 10 stocks allowed per watchlist"
}
```

---

### Remove Stock from Watchlist
Removes a stock from a watchlist.

**Endpoint**: `DELETE /watchlist/:id/stocks/:stockId`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "message": "Stock removed from watchlist"
}
```

---

### Delete Watchlist
Deletes a watchlist and all associated data.

**Endpoint**: `DELETE /watchlist/:id`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "message": "Watchlist deleted successfully"
}
```

---

## Stock Endpoints

### Get Stock Quote
Returns current stock quote data.

**Endpoint**: `GET /stock/quote/:ticker`

**Headers**: `Authorization: Bearer <token>`

**Example**: `GET /stock/quote/AAPL`

**Success Response** (200):
```json
{
  "quote": {
    "symbol": "AAPL",
    "price": 175.50,
    "change": 2.30,
    "changePercent": "1.33%",
    "volume": 58234567,
    "latestTradingDay": "2024-01-15",
    "previousClose": 173.20,
    "open": 174.00,
    "high": 176.20,
    "low": 173.80
  }
}
```

---

### Get Stock History
Returns historical price data for a stock.

**Endpoint**: `GET /stock/history/:ticker?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

**Success Response** (200):
```json
{
  "history": [
    {
      "id": 1,
      "ticker": "AAPL",
      "timestamp": "2024-01-01T09:30:00.000Z",
      "open": 173.50,
      "high": 175.00,
      "low": 173.00,
      "close": 174.50,
      "volume": 45678900
    }
  ]
}
```

---

### Get Stock Performance
Calculates stock performance since a start date.

**Endpoint**: `GET /stock/performance/:ticker?startDate=YYYY-MM-DD`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "ticker": "AAPL",
  "entryPrice": 150.00,
  "currentPrice": 175.50,
  "change": "25.50",
  "changePercent": "17.00",
  "performance": "gain"
}
```

---

## Alert Endpoints

### Get All Alerts
Returns all alerts for the authenticated user.

**Endpoint**: `GET /alert`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "alerts": [
    {
      "id": 1,
      "user_id": 1,
      "ticker": "AAPL",
      "watchlist_id": 1,
      "alert_type": "price_target",
      "threshold_value": 180.00,
      "condition": "above",
      "triggered": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Create Alert
Creates a new price alert.

**Endpoint**: `POST /alert`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "ticker": "AAPL",
  "watchlistId": 1,
  "alertType": "price_target",
  "thresholdValue": 180.00,
  "condition": "above"
}
```

**Alert Types**:
- `price_target`: Alert when price crosses threshold
- `percent_change`: Alert when daily change exceeds threshold
- `volume_spike`: Alert when volume exceeds threshold

**Conditions** (for price_target):
- `above`: Trigger when price goes above threshold
- `below`: Trigger when price goes below threshold

**Success Response** (201):
```json
{
  "message": "Alert created successfully",
  "alert": {
    "id": 1,
    "user_id": 1,
    "ticker": "AAPL",
    "watchlist_id": 1,
    "alert_type": "price_target",
    "threshold_value": 180.00,
    "condition": "above",
    "triggered": false
  }
}
```

---

### Delete Alert
Deletes an alert.

**Endpoint**: `DELETE /alert/:id`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "message": "Alert deleted successfully"
}
```

---

## Report Endpoints

### Generate Report
Generates a performance report for a watchlist.

**Endpoint**: `POST /report/generate/:watchlistId`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "message": "Report generated successfully",
  "report": {
    "watchlistName": "Tech Stocks Watch",
    "startDate": "2024-01-01",
    "endDate": "2024-01-15",
    "generatedAt": "2024-01-15T12:00:00.000Z",
    "summary": {
      "totalStocks": 5,
      "totalPortfolioValue": "15234.50",
      "totalPortfolioChange": "1234.50",
      "totalPortfolioChangePercent": "8.82",
      "bestPerformer": {
        "ticker": "NVDA",
        "changePercent": 15.5
      },
      "worstPerformer": {
        "ticker": "TSLA",
        "changePercent": -2.3
      }
    },
    "stockPerformances": [
      {
        "ticker": "AAPL",
        "entryPrice": "150.00",
        "currentPrice": "175.50",
        "change": "25.50",
        "changePercent": 17.00,
        "highestPrice": "176.20",
        "lowestPrice": "148.50",
        "sharesOwned": 10,
        "currentValue": "1755.00",
        "totalChange": "255.00",
        "performance": "gain"
      }
    ]
  }
}
```

---

### Get Watchlist Reports
Returns all reports for a specific watchlist.

**Endpoint**: `GET /report/watchlist/:watchlistId`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "reports": [
    {
      "id": 1,
      "watchlist_id": 1,
      "report_data": { ... },
      "generated_at": "2024-01-15T12:00:00.000Z"
    }
  ]
}
```

---

### Get Specific Report
Returns a specific report by ID.

**Endpoint**: `GET /report/:id`

**Headers**: `Authorization: Bearer <token>`

**Success Response** (200):
```json
{
  "report": {
    "id": 1,
    "watchlist_id": 1,
    "report_data": { ... },
    "generated_at": "2024-01-15T12:00:00.000Z"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

**401 Unauthorized**:
```json
{
  "error": "No authentication token provided"
}
```

**404 Not Found**:
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Something went wrong!"
}
```

---

## Rate Limiting

The Alpha Vantage free tier has the following limits:
- 5 API calls per minute
- 500 API calls per day

The app implements caching to minimize API calls. Stock data is cached for 15 minutes.

---

## Testing with cURL

### Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create watchlist:
```bash
curl -X POST http://localhost:5000/api/watchlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"My Watchlist","startDate":"2024-01-01","endDate":"2024-01-15"}'
```

### Get stock quote:
```bash
curl -X GET http://localhost:5000/api/stock/quote/AAPL \
  -H "Authorization: Bearer YOUR_TOKEN"
```
