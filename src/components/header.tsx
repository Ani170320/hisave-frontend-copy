// src/components/Header.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/header.css';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import logo from "../ai/assets/icons/Hisave logo.png";

const Header = ({ onLoginClick, onProfileClick, onMyCardsClick }) => {

  const { uid } = useAuth();
  const { searchTerm, setSearchTerm, setShowSearchResults } = useSearch();

  const navigate = useNavigate();
  const location = useLocation();
  const [showAppQR, setShowAppQR] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowSearchResults(term.trim().length > 0);
  };

  const handleHomeClick = () => {
    setSearchTerm('');
    setShowSearchResults(false);
    navigate('/');
  };

  return (
    <div className="header-container">
      <div className="header">

        {/* LEFT */}
        <div className="header-left">
          <div className="logo-section" onClick={handleHomeClick}>
            <img src={logo} alt="HiSave" className="header-logo" />
          </div>

          <button
            className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
            onClick={handleHomeClick}
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

        {/* CENTER */}
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

        {/* RIGHT */}
        <div className="header-right">

          <button
            className={`ai-nav-btn ${location.pathname.startsWith('/hisave-ai') ? 'active' : ''}`}
            onClick={() => navigate('/hisave-ai')}
          >
            <span className="ai-sparkle">✨</span> HiSave AI
          </button>

          <div
            className="getapp-section"
            onClick={() => setShowAppQR(!showAppQR)}
          >
            <img
              src="/assets/android.png"
              alt="android"
              className="android-icon"
            />
            <span className="getapp-text">Get The App</span>

            {showAppQR && (
              <img
                src="/assets/get-app.png"
                alt="Download App"
                className="getapp-qr"
              />
            )}
          </div>

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