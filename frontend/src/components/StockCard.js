import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './StockCard.css';

const StockCard = ({ stock, watchlistId, startDate, onRemove }) => {
  const [quote, setQuote] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchStockData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStockData, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stock.ticker, startDate]);

  const fetchStockData = async () => {
    try {
      const [quoteRes, perfRes] = await Promise.all([
        api.get(`/stock/quote/${stock.ticker}`),
        api.get(`/stock/performance/${stock.ticker}?startDate=${startDate}`)
      ]);
      setQuote(quoteRes.data.quote);
      setPerformance(perfRes.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stock-card">
        <p>Loading {stock.ticker}...</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="stock-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>{stock.ticker}</h3>
            <p className="error">Failed to load stock data</p>
          </div>
          <button className="button button-danger" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    );
  }

  const isGain = parseFloat(quote.change) >= 0;
  const periodIsGain = performance && parseFloat(performance.changePercent) >= 0;

  return (
    <div className={`stock-card ${periodIsGain ? 'gain-border' : 'loss-border'}`}>
      <div className="stock-header" onClick={() => setExpanded(!expanded)}>
        <div className="stock-title">
          <h3>{stock.ticker}</h3>
          <span className="stock-price">${quote.price.toFixed(2)}</span>
        </div>
        <div className="stock-metrics">
          <div>
            <span className="metric-label">Today:</span>
            <span className={isGain ? 'gain' : 'loss'}>
              {quote.change >= 0 ? '+' : ''}
              {quote.change.toFixed(2)} ({quote.changePercent})
            </span>
          </div>
          {performance && (
            <div>
              <span className="metric-label">Since Start:</span>
              <span className={periodIsGain ? 'gain' : 'loss'}>
                {performance.changePercent >= 0 ? '+' : ''}
                {performance.changePercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="stock-details">
          <div className="detail-row">
            <span>Open:</span>
            <span>${quote.open.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>High:</span>
            <span>${quote.high.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>Low:</span>
            <span>${quote.low.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>Previous Close:</span>
            <span>${quote.previousClose.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>Volume:</span>
            <span>{quote.volume.toLocaleString()}</span>
          </div>
          {stock.shares_owned > 0 && (
            <>
              <div className="detail-row">
                <span>Shares Owned:</span>
                <span>{stock.shares_owned}</span>
              </div>
              <div className="detail-row">
                <span>Position Value:</span>
                <span>${(stock.shares_owned * quote.price).toFixed(2)}</span>
              </div>
            </>
          )}
          <button 
            className="button button-danger" 
            onClick={onRemove}
            style={{ marginTop: '15px', width: '100%' }}
          >
            Remove from Watchlist
          </button>
        </div>
      )}
    </div>
  );
};

export default StockCard;
