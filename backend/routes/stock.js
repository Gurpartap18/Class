const express = require('express');
const authMiddleware = require('../middleware/auth');
const stockService = require('../services/stockService');
const db = require('../config/database');

const router = express.Router();

// Get current stock quote
router.get('/quote/:ticker', authMiddleware, async (req, res) => {
  try {
    const { ticker } = req.params;
    const quote = await stockService.getStockQuote(ticker.toUpperCase());
    
    if (!quote) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.json({ quote });
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    res.status(500).json({ error: 'Failed to fetch stock quote' });
  }
});

// Get historical price data for a stock
router.get('/history/:ticker', authMiddleware, async (req, res) => {
  try {
    const { ticker } = req.params;
    const { startDate, endDate } = req.query;

    const result = await db.query(
      `SELECT * FROM price_data 
       WHERE ticker = $1 
       AND timestamp >= $2 
       AND timestamp <= $3
       ORDER BY timestamp ASC`,
      [ticker.toUpperCase(), startDate, endDate]
    );

    res.json({ history: result.rows });
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

// Get stock performance summary
router.get('/performance/:ticker', authMiddleware, async (req, res) => {
  try {
    const { ticker } = req.params;
    const { startDate } = req.query;

    // Get current price
    const currentQuote = await stockService.getStockQuote(ticker.toUpperCase());
    
    // Get entry price from history
    const entryResult = await db.query(
      `SELECT close as entry_price FROM price_data 
       WHERE ticker = $1 
       AND timestamp >= $2
       ORDER BY timestamp ASC
       LIMIT 1`,
      [ticker.toUpperCase(), startDate]
    );

    if (entryResult.rows.length === 0 || !currentQuote) {
      return res.status(404).json({ error: 'Insufficient data' });
    }

    const entryPrice = parseFloat(entryResult.rows[0].entry_price);
    const currentPrice = currentQuote.price;
    const change = currentPrice - entryPrice;
    const changePercent = ((change / entryPrice) * 100).toFixed(2);

    res.json({
      ticker: ticker.toUpperCase(),
      entryPrice,
      currentPrice,
      change: change.toFixed(2),
      changePercent,
      performance: change >= 0 ? 'gain' : 'loss'
    });
  } catch (error) {
    console.error('Error calculating performance:', error);
    res.status(500).json({ error: 'Failed to calculate performance' });
  }
});

module.exports = router;
