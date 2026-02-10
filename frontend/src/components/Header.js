import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <div className="header">
      <nav className="nav">
        <div>
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
            <h1>📈 Stock Monitor</h1>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Welcome, {user?.email}</span>
          <button onClick={logout} className="button button-secondary">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Header;
