import React, { useEffect, useRef, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import HomeService from '../services/HomeService';
import Slider from 'react-slick';
import '../css/HomePage.css';
import HomeBankSection from "../components/HomeBankSection";
import OfferList from '../components/OfferList';
import SearchList from '../components/SearchList';
import { useSearch } from '../context/SearchContext';
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
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
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

        const [categoryData, voucherData] = await Promise.all([
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

  const searchCategory = (categoryName: string) => {
    setSearchTerm(categoryName);
    setShowSearchResults(true);
  };

  const settings = {
    infinite: false,
    slidesToShow: 10,
    slidesToScroll: 3,
    arrows: false,
    dots: false,
    speed: 500,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 3,
        },
      },
    ],
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      sliderRef.current?.slickNext();
    } else {
      sliderRef.current?.slickPrev();
    }
  };

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
                ariaLabel="oval-loading"
              />
            </div>
          )}

          {!isLoading && (
            <>

              {/* HERO CAROUSEL */}
              <HeroCarousel />

             <HomeBankSection />

            
              {/* OFFERS SECTION */}
              <OfferList offers={offers} />

            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;