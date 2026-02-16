// src/components/Header.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import '../css/header.css';
import HomeService from '../services/HomeService';

import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';

const Header = ({ onLoginClick, onProfileClick }) => {
  const [isLoading, setLoading] = useState(false);

  const { uid, setUID, setUser } = useAuth();
  const { searchTerm, setSearchTerm, setShowSearchResults } = useSearch();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // if (uid) {
    //   fetchCartCount();
    // }
  }, [uid]);

  // const fetchCartCount = async () => {
  //   try {
  //     setLoading(true);
  //     const payload = { uid: uid };
  //     const result = await HomeService.getCartCount(payload);
  //     const count = result.filter((item: { quantity: number }) => item.quantity > 0).length;
  //     console.log('cart count:', count);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.error('Error fetching cart count:', error);
  //   }
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowSearchResults(term.trim().length > 0);
  };



  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem('uid');
    localStorage.removeItem('user');
    setUID('');
    setUser('');
    clearCartCount();
    navigate('/');
    setLoading(false);
  };

  return (
    <div className="header-container">

      {isLoading && (
        <div className="loading-overlay">
          <Oval visible={true} height="60" width="60" color="#3b82f6" />
        </div>
      )}

      <div className="header">

        {/* LEFT SECTION */}
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
            className={`nav-btn ${location.pathname === '/cards' ? 'active' : ''}`}
            onClick={() => navigate('/cards')}
          >
            My Cards
          </button>

        </div>

        {/* CENTER SECTION */}
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

        {/* RIGHT SECTION */}
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