import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { AiProvider } from "./ai/context/AiContext";
import { UserCardProvider } from "./context/UserCardContext";

import Home from "./pages/Homepage";
import Footer from "./components/footer";
import Header from "./components/header";
import CartPage from "./pages/CartPage";
import CardDetails from "./pages/OfferDetailsPage";
import VoucherPage from "./pages/VoucherPage";
import LoginPopup from "./pages/LoginPage";
import EditProfileModal from "./components/profile";
import PageTitleSetter from "./components/PageTitle";
import HisaveAiPage from "./pages/HisaveAiPage";
import MyCardsPopup from "./components/MyCardsPopup";
import CardOffersPage from "./pages/CardOffersPage"; // ✅ NEW

const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMyCardsPopup, setShowMyCardsPopup] = useState(false);

  const location = useLocation();

  // Hide header/footer only for AI page
  const hideLayout = location.pathname.startsWith("/hisave-ai");

  return (
    <>
      {!hideLayout && (
        <Header
          onLoginClick={() => setShowLogin(true)}
          onProfileClick={() => setShowProfile(true)}
          onMyCardsClick={() => setShowMyCardsPopup(true)}
        />
      )}

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Cart */}
        <Route path="/cart" element={<CartPage />} />

        {/* Voucher */}
        <Route path="/voucher" element={<VoucherPage />} />

        {/* ✅ Card Offers List Page */}
        <Route path="/offers/:cardType" element={<CardOffersPage />} />

        {/* Offer Details Page */}
        <Route
          path="/offer-details/:offerId"
          element={
            <CardDetails onLoginClick={() => setShowLogin(true)} />
          }
        />

        {/* AI Page */}
        <Route
          path="/hisave-ai/*"
          element={
            <HisaveAiPage
              onShowMyCards={() => setShowMyCardsPopup(true)}
            />
          }
        />
      </Routes>

      {!hideLayout && <Footer />}

      {/* My Cards Popup */}
      <MyCardsPopup
        isOpen={showMyCardsPopup}
        onClose={() => setShowMyCardsPopup(false)}
      />

      {/* Login Popup */}
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}

      {/* Profile Modal */}
      {showProfile && (
        <EditProfileModal onClose={() => setShowProfile(false)} />
      )}
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