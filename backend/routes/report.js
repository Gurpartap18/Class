const express = require('express');
const authMiddleware = require('../middleware/auth');
const reportService = require('../services/reportService');
const db = require('../config/database');

const router = express.Router();

// Generate report for a watchlist
router.post('/generate/:watchlistId', authMiddleware, async (req, res) => {
  try {
    const { watchlistId } = req.params;

    // Verify watchlist belongs to user
    const watchlistResult = await db.query(
      'SELECT * FROM watchlists WHERE id = $1 AND user_id = $2',
      [watchlistId, req.userId]
    );

    if (watchlistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    const watchlist = watchlistResult.rows[0];
    const report = await reportService.generateReport(watchlist);

    // Save report to database
    await db.query(
      'INSERT INTO reports (watchlist_id, report_data) VALUES ($1, $2)',
      [watchlistId, JSON.stringify(report)]
    );

    res.json({ 
      message: 'Report generated successfully',
      report 
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Get all reports for a watchlist
router.get('/watchlist/:watchlistId', authMiddleware, async (req, res) => {
  try {
    const { watchlistId } = req.params;

    // Verify watchlist belongs to user
    const watchlistResult = await db.query(
      'SELECT id FROM watchlists WHERE id = $1 AND user_id = $2',
      [watchlistId, req.userId]
    );

    if (watchlistResult.rows.length === 0) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }

    const result = await db.query(
      'SELECT * FROM reports WHERE watchlist_id = $1 ORDER BY generated_at DESC',
      [watchlistId]
    );

    res.json({ reports: result.rows });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get specific report
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT r.* FROM reports r
       JOIN watchlists w ON r.watchlist_id = w.id
       WHERE r.id = $1 AND w.user_id = $2`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ report: result.rows[0] });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

module.exports = router;
