import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Homepage';
import Footer from './components/footer';
import Header from './components/header';
import CartPage from './pages/CartPage'; // make sure this file exists
import CardDetails from './components/CardDetails';
import VoucherPage from './pages/VoucherPage';
import LoginPopup from './pages/LoginPage';
import PageTitleSetter from './components/PageTitle';

const App = () => {
  
  const [showLogin, setShowLogin] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>      
          <PageTitleSetter />
          <Header onLoginClick={() => setShowLogin(true)} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/voucher" element={<VoucherPage />} />
            <Route path="/offer-details/:offerId"  element={<CardDetails onLoginClick={() => setShowLogin(true)}/>} />
          </Routes>
          <Footer />
          {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
