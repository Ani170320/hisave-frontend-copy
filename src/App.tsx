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
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import AboutUs from "./pages/AboutUs";
import PricingPage from "./pages/PricingPage";

const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMyCardsPopup, setShowMyCardsPopup] = useState(false);

  const location = useLocation();

  // Hide header & footer for AI and Pricing pages
  const hideLayout =
    location.pathname.startsWith("/hisave-ai") ||
    location.pathname === "/pricing";

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

        {/* Search */}
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
          element={<CardDetails onLoginClick={() => setShowLogin(true)} />}
        />

        {/* Add Card */}
        <Route path="/add-card" element={<AddCardPage />} />

        {/* Static Pages */}
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/about-us" element={<AboutUs />} />

        {/* AI Page */}
        <Route
          path="/hisave-ai/*"
          element={
            <HisaveAiPage
              onShowMyCards={() => setShowMyCardsPopup(true)}
            />
          }
        />

        {/* Pricing Page */}
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>

      {!hideLayout && <Footer />}

      {/* Popups & Modals */}
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