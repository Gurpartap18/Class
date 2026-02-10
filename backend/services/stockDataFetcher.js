const cron = require('node-cron');
const db = require('../config/database');
const stockService = require('./stockService');

class StockDataFetcher {
  constructor() {
    this.isRunning = false;
  }

  start() {
    console.log('Starting stock data fetcher service...');
    
    // Run every 15 minutes during market hours (9:30 AM - 4:00 PM ET, Mon-Fri)
    // For simplicity, this runs every 15 minutes and checks if market is open
    this.job = cron.schedule('*/15 * * * *', async () => {
      if (this.isRunning) {
        console.log('Previous fetch still running, skipping...');
        return;
      }

      this.isRunning = true;
      await this.fetchAllStockData();
      this.isRunning = false;
    });

    // Initial fetch
    this.fetchAllStockData();
  }

  async fetchAllStockData() {
    try {
      console.log('Fetching stock data...');

      // Get all unique tickers from active watchlists
      const result = await db.query(`
        SELECT DISTINCT ws.ticker
        FROM watchlist_stocks ws
        JOIN watchlists w ON ws.watchlist_id = w.id
        WHERE w.status = 'active'
      `);

      const tickers = result.rows.map(row => row.ticker);

      if (tickers.length === 0) {
        console.log('No active stocks to fetch');
        return;
      }

      console.log(`Fetching data for ${tickers.length} stocks...`);

      // Fetch quotes for all tickers (with delay to respect API rate limits)
      for (const ticker of tickers) {
        try {
          const quote = await stockService.getStockQuote(ticker);
          
          if (quote) {
            // Store in database
            await db.query(`
              INSERT INTO price_data (ticker, timestamp, open, high, low, close, volume)
              VALUES ($1, NOW(), $2, $3, $4, $5, $6)
              ON CONFLICT (ticker, timestamp) 
              DO UPDATE SET
                open = EXCLUDED.open,
                high = EXCLUDED.high,
                low = EXCLUDED.low,
                close = EXCLUDED.close,
                volume = EXCLUDED.volume
            `, [ticker, quote.open, quote.high, quote.low, quote.price, quote.volume]);

            console.log(`Updated data for ${ticker}: $${quote.price}`);
          }

          // Delay to respect API rate limits (free tier: 5 calls per minute)
          await this.delay(12000); // 12 seconds between calls
        } catch (error) {
          console.error(`Error fetching data for ${ticker}:`, error);
        }
      }

      console.log('Stock data fetch completed');
    } catch (error) {
      console.error('Error in fetchAllStockData:', error);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    if (this.job) {
      this.job.stop();
      console.log('Stock data fetcher service stopped');
    }
  }
}

module.exports = new StockDataFetcher();
