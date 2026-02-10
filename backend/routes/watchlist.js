const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get all watchlists for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT w.*, 
        COUNT(DISTINCT ws.id) as stock_count
       FROM watchlists w
       LEFT JOIN watchlist_stocks ws ON w.id = ws.watchlist_id
       WHERE w.user_id = $1
       GROUP BY w.id
       ORDER BY w.created_at DESC`,
      [req.userId]
    );

    res.json({ watchlists: result.rows });
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    res.status(500).json({ error: 'Failed to fetch watchlists' });
  }
});

// Get single watchlist with stocks
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Get watchlist
    const watchlistResult = await db.query(
      'SELECT * FROM watchlists WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (watchlistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    const watchlist = watchlistResult.rows[0];

    // Get stocks in watchlist
    const stocksResult = await db.query(
      'SELECT * FROM watchlist_stocks WHERE watchlist_id = $1',
      [id]
    );

    res.json({
      watchlist: {
        ...watchlist,
        stocks: stocksResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Create new watchlist
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Name, start date, and end date are required' });
    }

    const result = await db.query(
      `INSERT INTO watchlists (user_id, name, start_date, end_date, status)
       VALUES ($1, $2, $3, $4, 'active')
       RETURNING *`,
      [req.userId, name, startDate, endDate]
    );

    res.status(201).json({ 
      message: 'Watchlist created successfully',
      watchlist: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating watchlist:', error);
    res.status(500).json({ error: 'Failed to create watchlist' });
  }
});

// Add stock to watchlist
router.post('/:id/stocks', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { ticker, sharesOwned, entryPrice } = req.body;

    if (!ticker) {
      return res.status(400).json({ error: 'Ticker symbol is required' });
    }

    // Verify watchlist belongs to user
    const watchlistResult = await db.query(
      'SELECT id FROM watchlists WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (watchlistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    // Check stock count (max 10 for MVP)
    const countResult = await db.query(
      'SELECT COUNT(*) as count FROM watchlist_stocks WHERE watchlist_id = $1',
      [id]
    );

    if (parseInt(countResult.rows[0].count) >= 10) {
      return res.status(400).json({ error: 'Maximum 10 stocks allowed per watchlist' });
    }

    // Check if stock already exists in watchlist
    const existingStock = await db.query(
      'SELECT id FROM watchlist_stocks WHERE watchlist_id = $1 AND ticker = $2',
      [id, ticker.toUpperCase()]
    );

    if (existingStock.rows.length > 0) {
      return res.status(400).json({ error: 'Stock already in watchlist' });
    }

    // Add stock
    const result = await db.query(
      `INSERT INTO watchlist_stocks (watchlist_id, ticker, shares_owned, entry_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, ticker.toUpperCase(), sharesOwned || 0, entryPrice]
    );

    res.status(201).json({
      message: 'Stock added to watchlist',
      stock: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding stock:', error);
    res.status(500).json({ error: 'Failed to add stock' });
  }
});

// Remove stock from watchlist
router.delete('/:id/stocks/:stockId', authMiddleware, async (req, res) => {
  try {
    const { id, stockId } = req.params;

    // Verify watchlist belongs to user
    const watchlistResult = await db.query(
      'SELECT id FROM watchlists WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (watchlistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    // Delete stock
    const result = await db.query(
      'DELETE FROM watchlist_stocks WHERE id = $1 AND watchlist_id = $2 RETURNING *',
      [stockId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock not found in watchlist' });
    }

    res.json({ message: 'Stock removed from watchlist' });
  } catch (error) {
    console.error('Error removing stock:', error);
    res.status(500).json({ error: 'Failed to remove stock' });
  }
});

// Delete watchlist
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM watchlists WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    res.json({ message: 'Watchlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting watchlist:', error);
    res.status(500).json({ error: 'Failed to delete watchlist' });
  }
});

module.exports = router;
