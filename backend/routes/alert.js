const express = require('express');
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get all alerts for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, ws.ticker 
       FROM alerts a
       JOIN watchlist_stocks ws ON a.ticker = ws.ticker
       JOIN watchlists w ON a.watchlist_id = w.id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [req.userId]
    );

    res.json({ alerts: result.rows });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Create new alert
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { ticker, watchlistId, alertType, thresholdValue, condition } = req.body;

    if (!ticker || !watchlistId || !alertType || !thresholdValue) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify watchlist belongs to user
    const watchlistResult = await db.query(
      'SELECT id FROM watchlists WHERE id = $1 AND user_id = $2',
      [watchlistId, req.userId]
    );

    if (watchlistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    const result = await db.query(
      `INSERT INTO alerts (user_id, ticker, watchlist_id, alert_type, threshold_value, condition)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.userId, ticker.toUpperCase(), watchlistId, alertType, thresholdValue, condition]
    );

    res.status(201).json({
      message: 'Alert created successfully',
      alert: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Delete alert
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM alerts WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

module.exports = router;
