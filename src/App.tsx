import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import Home from './pages/Homepage';
import Footer from './components/footer';
import Header from './components/header';
import CartPage from './pages/CartPage'; // make sure this file exists
import CardDetails from './pages/OfferDetailsPage';
import VoucherPage from './pages/VoucherPage';
import LoginPopup from './pages/LoginPage';
import EditProfileModal from './components/profile';
import PageTitleSetter from './components/PageTitle';

const App = () => {
  
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false)
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <Router>      
            <PageTitleSetter />
            <Header onLoginClick={() => setShowLogin(true)} onProfileClick={() => setShowProfile(true)} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/voucher" element={<VoucherPage />} />
              <Route path="/offer-details/:offerId"  element={<CardDetails onLoginClick={() => setShowLogin(true)}/>} />
            </Routes>
            <Footer />
            {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
            {showProfile && <EditProfileModal onClose={() => setShowProfile(false)} />}
          </Router>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
