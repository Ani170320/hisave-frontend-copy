import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Homepage';
import Footer from './components/footer';
import Header from './components/header';
import CartPage from './pages/CartPage'; // make sure this file exists
import CardDetails from './components/CardDetails';
import PageTitleSetter from './components/PageTitle';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <PageTitleSetter />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/offer-details/:offerId" element={<CardDetails />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;
