import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import StockCard from '../components/StockCard';
import AddStockModal from '../components/AddStockModal';
import './WatchlistDetail.css';

const WatchlistDetail = () => {
  const { id } = useParams();
  const [watchlist, setWatchlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, [id]);

  const fetchWatchlist = async () => {
    try {
      const response = await api.get(`/watchlist/${id}`);
      setWatchlist(response.data.watchlist);
    } catch (err) {
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = () => {
    setShowModal(false);
    fetchWatchlist();
  };

  const handleRemoveStock = async (stockId) => {
    if (!window.confirm('Remove this stock from watchlist?')) {
      return;
    }

    try {
      await api.delete(`/watchlist/${id}/stocks/${stockId}`);
      fetchWatchlist();
    } catch (err) {
      alert('Failed to remove stock');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !watchlist) {
    return (
      <div className="container">
        <div className="error">{error || 'Watchlist not found'}</div>
        <Link to="/" className="button button-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="watchlist-header">
        <div>
          <h2>{watchlist.name}</h2>
          <p className="watchlist-period">
            {new Date(watchlist.start_date).toLocaleDateString()} -{' '}
            {new Date(watchlist.end_date).toLocaleDateString()}
          </p>
        </div>
        <button className="button button-primary" onClick={() => setShowModal(true)}>
          + Add Stock
        </button>
      </div>

      {watchlist.stocks.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666' }}>
            No stocks in this watchlist. Add stocks to start monitoring!
          </p>
        </div>
      ) : (
        <div>
          {watchlist.stocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              watchlistId={id}
              startDate={watchlist.start_date}
              onRemove={() => handleRemoveStock(stock.id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddStockModal
          watchlistId={id}
          onClose={() => setShowModal(false)}
          onAdd={handleAddStock}
        />
      )}
    </div>
  );
};

export default WatchlistDetail;
