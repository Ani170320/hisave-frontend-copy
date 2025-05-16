// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import '../css/header.css'
import HomeService from '../services/HomeService';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';


const Header = ({ onLoginClick, onProfileClick, onSearch }) => {
    const [isLoading, setLoading] = useState(false);
    const [searchWords, setSearchWords] = useState('')
    const [showImage, setShowImage] = useState(false);
    // const [cartCount, setCartCount] = useState(0);
    
    const { cartCount } = useCart(); 
    const { clearCartCount  } = useCart();
    const navigate = useNavigate();
    
    const location = useLocation();
    const isLandingPage = location.pathname === '/';

    const { uid, setUID, user, setUser } = useAuth(); 
    
    const { searchTerm, setSearchTerm, setShowSearchResults } = useSearch();


    useEffect(() => {
        if (uid) {
            fetchCartCount();
        }
    }, [uid]);


    useEffect(() => {
        if (searchTerm.trim().length > 3) {
          setShowSearchResults(true);
        } else {
          setShowSearchResults(false);
        }
    }, [searchTerm, setShowSearchResults]);
          
    const fetchCartCount = async () => {
        try {
            setLoading(true)
            const payload = {
                uid: uid,
            }
            const result = await HomeService.getCartCount(payload);
            const count = result.filter((item: { quantity: number; }) => item.quantity > 0).length;
            // setCartCount(count);
            console.log('cart count:', count);
            setLoading(false)
          
        } catch (error) {
            setLoading(false)
            console.error('Error fetching homepage categories:', error);
        }
    };
    
    const searchDetails = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setShowSearchResults(term.trim() !== '');
    };
    
    const handleInputChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
    };
    
    const handleSearchClick = () => {
        if (searchTerm.trim()) {
          setShowSearchResults(true);
        }
    };

    const getApp = () => {
        setShowImage(prev => !prev);
    };
    
    const cartPage = () => {
        navigate('/cart')
    }

    const handleLogout = () => {
        setLoading(true);
        localStorage.removeItem('uid');
        localStorage.removeItem('user')
        setUID('');           // This will re-trigger useEffect in CartContext
        setUser('')
        console.log('local:',localStorage.getItem('uid'), user)
        clearCartCount();       // Immediately clear cart
        navigate('/')
        setLoading(false);
    };
    
    const goToHome = () => {
        setSearchTerm('')
        setShowSearchResults(false)
    }

    return (
        <div className="">
        {isLoading ? (
                <div className="loading-overlay">
                    <Oval visible={true} height="80" width="80" color="#3b82f6" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" />
                </div>
              ) : (
                <div>
            <div className='lap-tab header-section'> 
                                
                <div className="logo-section">
                    <img src="/assets/logo.png" alt="HiSave" className="header-logo w-10 h-10" onClick={() => goToHome()}/>
                </div>

                {/* <div className="search-section">
                    <img src="/assets/search.png" alt="Search" className="search-icon w-5 h-5 mr-2" />
                    <input type="text" placeholder="Search" className="search-bar"onChange={() => searchDetails(searchWords)}/>
                    <img src="/assets/filter.png" alt="Filter" className="filter-icon w-5 h-5 ml-2 cursor-pointer" />
                </div> */}

                <div className="mob-search-section-1">
                    <div className='search-img-1'>
                        <img src="/assets/search.png" alt="Search" className="search-icon-1 w-5 h-5 mr-2" />
                    </div>
                    
                    <div className="">
                        <input type="text" placeholder="Search" value={searchTerm} className="search-bar"
                            onChange={handleInputChange}/>
                            {/* onChange={(e) => { setSearchTerm(e.target.value)}}/> */}
                    </div>
                    
                    {/* <img src="/assets/filter.png" alt="Filter" className="filter-icon w-5 h-5 ml-2 cursor-pointer" /> */}
                </div>


                <div className="right-section d-flex flex-grow-1 justify-content-end align-items-center">
                    <div className="getapp-section d-flex align-items-center" onClick={() => getApp()}>
                        <img src="/assets/android.png" alt="android" className="android-icon m-2" />
                        <span className="header-text">Get The App</span>
                        {showImage && (
                            <img src="/assets/get-app.png" alt="Download App" className="get-app-img w-28" />
                        )}
                    </div>

                    <div className="cart-section  d-none align-items-center" onClick={() => cartPage()}>
                        <img src="/assets/cart.png" alt="cart" className="cart-icon m-1" />
                        {cartCount > 0 && (
                            <span className="cart-count-badge">{cartCount}</span>
                        )}
                        <span className="header-text">Cart</span>
                    </div>
                
                    <div className="login-wrapper">
                        <div className="login-section" onClick={!uid ? onLoginClick : undefined}>
                            {/* <img src="/assets/user.png" alt="user" className="user-icon" /> */}
                            <span className="header-text login-text">
                                {uid ? 'My Profile' : 'Login'}
                            </span>
                        </div>
                        {uid && (
                            <ul className="profile-dropdown">
                                <li onClick={onProfileClick}>My Profile</li>
                                {/* <li>My Transactions</li> */}
                                {/* <li onClick={() => navigate('/voucher')}>My Vouchers</li> */}
                                <li onClick={() => handleLogout()}>Logout</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <div className='mob mob-header-section'> 
                <div className="me-3 d-none menu-icon-section">
                    <img src="/assets/menu.png" alt="Menu" className="menu-icon" />
                </div>
                
                <div className="logo-section">
                    <img src="/assets/logo.png" alt="HiSave" className="header-logo w-10 h-10" onClick={() => navigate('/')}/>
                </div>

                <div className="right-section d-flex flex-grow-1 justify-content-end align-items-center">
                    {/* <div className="getapp-section d-flex align-items-center" onClick={() => getApp()}>
                        <img src="/assets/android.png" alt="android" className="android-icon m-2" />
                        <span className="header-text">Get The App</span>
                    </div> */}

                    <div className="cart-section  d-none align-items-center" onClick={() => cartPage()}>
                        <img src="/assets/cart.png" alt="cart" className="cart-icon m-1" />
                        {cartCount > 0 && uid && (
                            <span className="cart-count-badge">{cartCount}</span>
                        )}
                        {/* <span className="header-text">Cart</span> */}
                    </div>

                    <div className="login-wrapper">
                        <div className="login-section" onClick={!uid ? onLoginClick : undefined}>
                            {/* <img src="/assets/user.png" alt="user" className="user-icon" /> */}
                            <span className="header-text login-text">
                                {uid ? 'My Profile' : 'Login'}
                            </span>
                        </div>
                        {uid && (
                            <ul className="profile-dropdown">
                                <li onClick={onProfileClick}>My Profile</li>
                                {/* <li>My Transactions</li>
                                <li>My Vouchers</li> */}
                                <li onClick={() => handleLogout()}>Logout</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>

          
            {isLandingPage && (
                <div className="mob-search-section">
                    <div className='mob-search-img'>
                        <img src="/assets/search.png" alt="Search" className="search-icon w-5 h-5 mr-2" />
                    </div>
                    
                    <div className="">
                        <input type="text" placeholder="Search" className="search-bar" onChange={handleInputChange}/>
                    </div>
                    
                    {/* <img src="/assets/filter.png" alt="Filter" className="filter-icon w-5 h-5 ml-2 cursor-pointer" /> */}
                </div>
            )}
        </div>
        )}
        </div>
    );
};

export default Header;
