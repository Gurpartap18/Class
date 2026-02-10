const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(to, subject, text) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('Email service not configured. Email would be sent to:', to);
        console.log('Subject:', subject);
        console.log('Message:', text);
        return;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendDailySummary(userEmail, watchlistData) {
    const subject = 'Daily Stock Watchlist Summary';
    let message = 'Here is your daily stock watchlist summary:\n\n';

    for (const stock of watchlistData.stocks) {
      message += `${stock.ticker}: $${stock.price} (${stock.changePercent})\n`;
    }

    message += '\nView your full watchlist for detailed information.';

    await this.sendEmail(userEmail, subject, message);
  }
}

module.exports = new EmailService();
