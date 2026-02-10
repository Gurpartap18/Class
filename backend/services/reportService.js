const db = require('../config/database');
const stockService = require('./stockService');

class ReportService {
  async generateReport(watchlist) {
    try {
      const { id, name, start_date, end_date } = watchlist;

      // Get all stocks in watchlist
      const stocksResult = await db.query(
        'SELECT * FROM watchlist_stocks WHERE watchlist_id = $1',
        [id]
      );

      const stocks = stocksResult.rows;
      const stockPerformances = [];
      let totalPortfolioValue = 0;
      let totalPortfolioChange = 0;

      // Calculate performance for each stock
      for (const stock of stocks) {
        const performance = await this.calculateStockPerformance(
          stock.ticker,
          start_date,
          end_date,
          stock.entry_price,
          stock.shares_owned
        );
        
        stockPerformances.push(performance);

        if (stock.shares_owned > 0) {
          totalPortfolioValue += performance.currentValue;
          totalPortfolioChange += performance.totalChange;
        }
      }

      // Sort by performance
      stockPerformances.sort((a, b) => b.changePercent - a.changePercent);

      const bestPerformer = stockPerformances[0];
      const worstPerformer = stockPerformances[stockPerformances.length - 1];

      const report = {
        watchlistName: name,
        startDate: start_date,
        endDate: end_date,
        generatedAt: new Date(),
        summary: {
          totalStocks: stocks.length,
          totalPortfolioValue: totalPortfolioValue.toFixed(2),
          totalPortfolioChange: totalPortfolioChange.toFixed(2),
          totalPortfolioChangePercent: totalPortfolioValue > 0 
            ? ((totalPortfolioChange / (totalPortfolioValue - totalPortfolioChange)) * 100).toFixed(2)
            : 0,
          bestPerformer: {
            ticker: bestPerformer.ticker,
            changePercent: bestPerformer.changePercent
          },
          worstPerformer: {
            ticker: worstPerformer.ticker,
            changePercent: worstPerformer.changePercent
          }
        },
        stockPerformances
      };

      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  async calculateStockPerformance(ticker, startDate, endDate, entryPrice, sharesOwned) {
    try {
      // Get entry price from database if not provided
      if (!entryPrice) {
        const entryResult = await db.query(
          `SELECT close FROM price_data 
           WHERE ticker = $1 AND DATE(timestamp) >= $2
           ORDER BY timestamp ASC
           LIMIT 1`,
          [ticker, startDate]
        );

        if (entryResult.rows.length > 0) {
          entryPrice = parseFloat(entryResult.rows[0].close);
        }
      }

      // Get current or end price
      const currentQuote = await stockService.getStockQuote(ticker);
      const currentPrice = currentQuote ? currentQuote.price : null;

      // Get price history for the period
      const historyResult = await db.query(
        `SELECT close, high, low, timestamp 
         FROM price_data 
         WHERE ticker = $1 
         AND DATE(timestamp) >= $2 
         AND DATE(timestamp) <= $3
         ORDER BY timestamp ASC`,
        [ticker, startDate, endDate]
      );

      const history = historyResult.rows;

      // Calculate metrics
      const change = currentPrice - entryPrice;
      const changePercent = ((change / entryPrice) * 100).toFixed(2);
      
      const highestPrice = Math.max(...history.map(h => parseFloat(h.high)));
      const lowestPrice = Math.min(...history.map(h => parseFloat(h.low)));

      const currentValue = sharesOwned * currentPrice;
      const totalChange = sharesOwned * change;

      return {
        ticker,
        entryPrice: entryPrice ? entryPrice.toFixed(2) : 'N/A',
        currentPrice: currentPrice ? currentPrice.toFixed(2) : 'N/A',
        change: change.toFixed(2),
        changePercent: parseFloat(changePercent),
        highestPrice: highestPrice.toFixed(2),
        lowestPrice: lowestPrice.toFixed(2),
        sharesOwned,
        currentValue: currentValue.toFixed(2),
        totalChange: totalChange.toFixed(2),
        performance: change >= 0 ? 'gain' : 'loss'
      };
    } catch (error) {
      console.error(`Error calculating performance for ${ticker}:`, error);
      return {
        ticker,
        error: 'Failed to calculate performance'
      };
    }
  }
}

module.exports = new ReportService();
