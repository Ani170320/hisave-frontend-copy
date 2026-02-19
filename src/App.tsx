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

import CardDetails from "./pages/OfferDetailsPage";
import VoucherPage from "./pages/VoucherPage";
import LoginPopup from "./pages/LoginPage";
import EditProfileModal from "./components/profile";
import PageTitleSetter from "./components/PageTitle";
import HisaveAiPage from "./pages/HisaveAiPage";
import MyCardsPopup from "./components/MyCardsPopup";
import CardOffersPage from "./pages/CardOffersPage";
import SearchList from "./components/SearchList";   
import AddCardPage from "./pages/AddCardPage";

const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMyCardsPopup, setShowMyCardsPopup] = useState(false);

  const location = useLocation();

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

        {/* 🔥 SEARCH PAGE (IMPORTANT) */}
        <Route
          path="/search"
          element={<SearchList onBack={() => window.history.back()} />}
        />

        {/* Voucher */}
        <Route path="/voucher" element={<VoucherPage />} />

        {/* Card Offers */}
        <Route path="/offers/:cardType" element={<CardOffersPage />} />

        {/* Offer Details */}
        <Route
          path="/offer-details/:offerId"
          element={
            <CardDetails onLoginClick={() => setShowLogin(true)} />
          }
        />
        <Route path="/add-card" element={<AddCardPage />} />

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

      <MyCardsPopup
        isOpen={showMyCardsPopup}
        onClose={() => setShowMyCardsPopup(false)}
      />

      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}

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