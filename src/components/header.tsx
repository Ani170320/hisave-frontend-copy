import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/header.css';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

const Header = ({ onLoginClick, onProfileClick, onMyCardsClick }) => {

  const { uid } = useAuth();
  const { searchTerm, setSearchTerm, setShowSearchResults } = useSearch();

  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowSearchResults(term.trim().length > 0);
  };

  return (
    <div className="header-container">
      <div className="header">

        <div className="header-left">

          <div className="logo-section" onClick={() => navigate('/')}>
            <img src="/assets/logo.png" alt="HiSave" className="header-logo" />
          </div>

          <button
            className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Home
          </button>

          <button
            className="nav-btn"
            onClick={onMyCardsClick}
          >
            My Cards
          </button>

        </div>

        <div className="header-center">
          <div className="search-wrapper">
            <img src="/assets/search.png" alt="search" className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleInputChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="header-right">
          <button
            className="signup-btn"
            onClick={!uid ? onLoginClick : onProfileClick}
          >
            {uid ? 'My Profile' : 'Sign up free →'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Header;