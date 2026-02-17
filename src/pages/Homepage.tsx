import React, { useEffect, useRef, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import HomeService from '../services/HomeService';
import Slider from 'react-slick';
import '../css/HomePage.css';
import '../css/MyCards.css';
import HomeBankSection from "../components/HomeBankSection";
import OfferList from '../components/OfferList';
import SearchList from '../components/SearchList';
import { useSearch } from '../context/SearchContext';
import { useUserCards } from "../context/UserCardContext";
import HeroCarousel from '../components/HeroCarousel';

interface CategoryItem {
  icon: string;
  name: string;
}

interface Offer {
  offerId: number;
  merchantName: string;
  shortTitle: string;
  offerImageLink: string;
  redemptionLink: string;
}

const Home: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showMyCardsPopup, setShowMyCardsPopup] = useState(false);

  const { cards } = useUserCards();

  const sliderRef = useRef<Slider | null>(null);

  const {
    showSearchResults,
    setShowSearchResults,
    searchTerm,
    setSearchTerm
  } = useSearch();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [, voucherData] = await Promise.all([
          HomeService.getData(),
          HomeService.getVouchers()
        ]);

        setOffers(voucherData || []);
      } catch (error) {
        console.error('Error loading homepage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* 🔥 OPEN MY CARDS POPUP FROM HEADER */
  useEffect(() => {
    const shouldOpen = sessionStorage.getItem("openMyCardsPopupHome");

    if (shouldOpen === "true") {
      setShowMyCardsPopup(true);
      sessionStorage.removeItem("openMyCardsPopupHome");
    }
  }, []);

  return (
    <div>

      {showSearchResults ? (
        <SearchList
          searchTerm={searchTerm}
          onBack={() => {
            setShowSearchResults(false);
            setSearchTerm('');
          }}
        />
      ) : (
        <>
          {isLoading && (
            <div className="loading-overlay">
              <Oval
                visible={true}
                height="60"
                width="60"
                color="#3b82f6"
              />
            </div>
          )}

          {!isLoading && (
            <>
              <HeroCarousel />
              <HomeBankSection />
              <OfferList offers={offers} />
            </>
          )}
        </>
      )}

      {/* 🔥 MY CARDS POPUP ON HOME */}
      {showMyCardsPopup && (
        <div className="mycards-overlay">
          <div className="mycards-modal">

            <div className="mycards-header">
              <h2>My Cards</h2>
              <span onClick={() => setShowMyCardsPopup(false)}>×</span>
            </div>

            <div className="mycards-tabs">
              <div className="tab active">
                My Cards ({cards.length})
              </div>
            </div>

            <div className="cards-row">
              {cards.map((card, index) => (
                <div key={index} className="card-box">
                  <div className="card-top">
                    <span>{card.network}</span>
                    <span className="show-offer">Show Offer</span>
                  </div>
                  <div className="card-bottom">
                    <span>{card.cardName}</span>
                    <span>{card.cardType} card</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;