import React, { useState } from 'react';
import api from '../services/api';

const CreateWatchlistModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('1week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateEndDate = (startDate, duration) => {
    const end = new Date(startDate);
    switch (duration) {
      case '1week':
        end.setDate(end.getDate() + 7);
        break;
      case '2weeks':
        end.setDate(end.getDate() + 14);
        break;
      case '1month':
        end.setMonth(end.getMonth() + 1);
        break;
      default:
        end.setDate(end.getDate() + 7);
    }
    return end.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = calculateEndDate(new Date(), duration);

    try {
      await api.post('/watchlist', {
        name,
        startDate,
        endDate
      });
      onCreate();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create watchlist');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Create New Watchlist</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Watchlist Name</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tech Stocks Watch"
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Monitoring Duration</label>
            <select
              className="input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="1week">1 Week</option>
              <option value="2weeks">2 Weeks</option>
              <option value="1month">1 Month</option>
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Watchlist'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWatchlistModal;
