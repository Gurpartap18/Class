import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CreateWatchlistModal from '../components/CreateWatchlistModal';
import './Dashboard.css';

const Dashboard = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    try {
      const response = await api.get('/watchlist');
      setWatchlists(response.data.watchlists);
    } catch (err) {
      setError('Failed to load watchlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWatchlist = () => {
    setShowModal(false);
    fetchWatchlists();
  };

  const handleDeleteWatchlist = async (id) => {
    if (!window.confirm('Are you sure you want to delete this watchlist?')) {
      return;
    }

    try {
      await api.delete(`/watchlist/${id}`);
      fetchWatchlists();
    } catch (err) {
      alert('Failed to delete watchlist');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Watchlists</h2>
        <button className="button button-primary" onClick={() => setShowModal(true)}>
          + Create Watchlist
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {watchlists.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666' }}>
            No watchlists yet. Create your first watchlist to start monitoring stocks!
          </p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlists.map((watchlist) => (
            <div key={watchlist.id} className="watchlist-card">
              <h3>{watchlist.name}</h3>
              <div className="watchlist-info">
                <p>
                  <strong>Stocks:</strong> {watchlist.stock_count}
                </p>
                <p>
                  <strong>Period:</strong> {new Date(watchlist.start_date).toLocaleDateString()} -{' '}
                  {new Date(watchlist.end_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status ${watchlist.status}`}>{watchlist.status}</span>
                </p>
              </div>
              <div className="watchlist-actions">
                <Link to={`/watchlist/${watchlist.id}`} className="button button-primary">
                  View Details
                </Link>
                <button
                  className="button button-danger"
                  onClick={() => handleDeleteWatchlist(watchlist.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateWatchlistModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateWatchlist}
        />
      )}
    </div>
  );
};

export default Dashboard;
