import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { AiProvider } from "./ai/context/AiContext";
import { UserCardProvider } from "./context/UserCardContext";

import Home from './pages/Homepage';
import Footer from './components/footer';
import Header from './components/header';
import CartPage from './pages/CartPage';
import CardDetails from './pages/OfferDetailsPage';
import VoucherPage from './pages/VoucherPage';
import LoginPopup from './pages/LoginPage';
import EditProfileModal from './components/profile';
import PageTitleSetter from './components/PageTitle';
import HisaveAiPage from './pages/HisaveAiPage';
import AddCardPage from './pages/AddCardPage';

const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();

  // 🔥 Hide Header/Footer for all AI related routes
  const hideLayout =
    location.pathname.startsWith("/hisave-ai") ||
    location.pathname.startsWith("/add-card");

  return (
    <>
      {!hideLayout && (
        <Header
          onLoginClick={() => setShowLogin(true)}
          onProfileClick={() => setShowProfile(true)}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/voucher" element={<VoucherPage />} />
        <Route
          path="/offer-details/:offerId"
          element={<CardDetails onLoginClick={() => setShowLogin(true)} />}
        />

        {/* AI Routes */}
        <Route path="/hisave-ai/*" element={<HisaveAiPage />} />
        <Route path="/add-card" element={<AddCardPage />} />
      </Routes>

      {!hideLayout && <Footer />}

      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      {showProfile && <EditProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <UserCardProvider>
            <AiProvider>
              <Router>
                <PageTitleSetter />
                <AppContent />
              </Router>
            </AiProvider>
          </UserCardProvider>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;