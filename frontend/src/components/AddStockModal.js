import React, { useState } from 'react';
import api from '../services/api';

const AddStockModal = ({ watchlistId, onClose, onAdd }) => {
  const [ticker, setTicker] = useState('');
  const [sharesOwned, setSharesOwned] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post(`/watchlist/${watchlistId}/stocks`, {
        ticker: ticker.toUpperCase(),
        sharesOwned: sharesOwned ? parseFloat(sharesOwned) : 0
      });
      onAdd();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add stock');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Add Stock to Watchlist</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Stock Ticker Symbol</label>
            <input
              type="text"
              className="input"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="e.g., AAPL, TSLA, MSFT"
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Shares Owned (Optional)</label>
            <input
              type="number"
              className="input"
              value={sharesOwned}
              onChange={(e) => setSharesOwned(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
            Maximum 10 stocks per watchlist
          </p>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Stock'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStockModal;
