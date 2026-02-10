const fetch = require('node-fetch');
require('dotenv').config();

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Cache to reduce API calls (free tier has rate limits)
const cache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

class StockService {
  async getStockQuote(ticker) {
    try {
      const cacheKey = `quote_${ticker}`;
      const cached = cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
        const quote = {
          symbol: data['Global Quote']['01. symbol'],
          price: parseFloat(data['Global Quote']['05. price']),
          change: parseFloat(data['Global Quote']['09. change']),
          changePercent: data['Global Quote']['10. change percent'],
          volume: parseInt(data['Global Quote']['06. volume']),
          latestTradingDay: data['Global Quote']['07. latest trading day'],
          previousClose: parseFloat(data['Global Quote']['08. previous close']),
          open: parseFloat(data['Global Quote']['02. open']),
          high: parseFloat(data['Global Quote']['03. high']),
          low: parseFloat(data['Global Quote']['04. low'])
        };

        cache.set(cacheKey, { data: quote, timestamp: Date.now() });
        return quote;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching quote for ${ticker}:`, error);
      return null;
    }
  }

  async getIntradayData(ticker) {
    try {
      const url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=15min&apikey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data['Time Series (15min)']) {
        const timeSeries = data['Time Series (15min)'];
        return Object.entries(timeSeries).map(([timestamp, values]) => ({
          timestamp,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume'])
        }));
      }

      return [];
    } catch (error) {
      console.error(`Error fetching intraday data for ${ticker}:`, error);
      return [];
    }
  }

  async getDailyData(ticker) {
    try {
      const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data['Time Series (Daily)']) {
        const timeSeries = data['Time Series (Daily)'];
        return Object.entries(timeSeries).map(([date, values]) => ({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume'])
        }));
      }

      return [];
    } catch (error) {
      console.error(`Error fetching daily data for ${ticker}:`, error);
      return [];
    }
  }

  clearCache() {
    cache.clear();
  }
}

module.exports = new StockService();
