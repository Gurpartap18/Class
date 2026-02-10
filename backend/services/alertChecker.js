const cron = require('node-cron');
const db = require('../config/database');
const stockService = require('./stockService');
const emailService = require('./emailService');

class AlertChecker {
  constructor() {
    this.isRunning = false;
  }

  start() {
    console.log('Starting alert checker service...');
    
    // Check alerts every 5 minutes
    this.job = cron.schedule('*/5 * * * *', async () => {
      if (this.isRunning) {
        console.log('Previous alert check still running, skipping...');
        return;
      }

      this.isRunning = true;
      await this.checkAllAlerts();
      this.isRunning = false;
    });
  }

  async checkAllAlerts() {
    try {
      // Get all active (non-triggered) alerts
      const result = await db.query(`
        SELECT a.*, u.email, w.name as watchlist_name
        FROM alerts a
        JOIN users u ON a.user_id = u.id
        JOIN watchlists w ON a.watchlist_id = w.id
        WHERE a.triggered = FALSE AND w.status = 'active'
      `);

      const alerts = result.rows;

      if (alerts.length === 0) {
        return;
      }

      console.log(`Checking ${alerts.length} alerts...`);

      for (const alert of alerts) {
        try {
          const shouldTrigger = await this.checkAlert(alert);
          
          if (shouldTrigger) {
            // Mark as triggered
            await db.query(
              'UPDATE alerts SET triggered = TRUE, triggered_at = NOW() WHERE id = $1',
              [alert.id]
            );

            // Send notification
            await this.sendAlertNotification(alert);
            
            console.log(`Alert triggered for ${alert.ticker}: ${alert.alert_type}`);
          }
        } catch (error) {
          console.error(`Error checking alert ${alert.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in checkAllAlerts:', error);
    }
  }

  async checkAlert(alert) {
    const quote = await stockService.getStockQuote(alert.ticker);
    
    if (!quote) {
      return false;
    }

    switch (alert.alert_type) {
      case 'price_target':
        if (alert.condition === 'above' && quote.price >= alert.threshold_value) {
          return true;
        }
        if (alert.condition === 'below' && quote.price <= alert.threshold_value) {
          return true;
        }
        break;

      case 'percent_change':
        const changePercent = Math.abs(parseFloat(quote.changePercent));
        if (changePercent >= alert.threshold_value) {
          return true;
        }
        break;

      case 'volume_spike':
        // Simple volume spike detection (volume > threshold)
        if (quote.volume >= alert.threshold_value) {
          return true;
        }
        break;
    }

    return false;
  }

  async sendAlertNotification(alert) {
    try {
      const quote = await stockService.getStockQuote(alert.ticker);
      
      const subject = `Stock Alert: ${alert.ticker}`;
      const message = `
        Your alert for ${alert.ticker} has been triggered!
        
        Watchlist: ${alert.watchlist_name}
        Alert Type: ${alert.alert_type}
        Threshold: ${alert.threshold_value}
        
        Current Price: $${quote.price}
        Change: ${quote.change} (${quote.changePercent})
        Volume: ${quote.volume}
        
        View your watchlist for more details.
      `;

      await emailService.sendEmail(alert.email, subject, message);
    } catch (error) {
      console.error('Error sending alert notification:', error);
    }
  }

  stop() {
    if (this.job) {
      this.job.stop();
      console.log('Alert checker service stopped');
    }
  }
}

module.exports = new AlertChecker();
