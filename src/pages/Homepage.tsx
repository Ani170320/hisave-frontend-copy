import React, { useEffect, useRef, useState } from 'react';
import type { CustomArrowProps } from 'react-slick';
import Header from '../components/header';
import Footer from '../components/footer';
import HomeService from '../services/HomeService';
import Slider from 'react-slick'; // Import react-slick
import LoadingEarnings from '../components/loader';
import './HomePage.css';

import OfferList from '../components/OfferList';

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface CategoryItem {
  icon: string;
  name: string;
}

interface CarouselItem {
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
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [carouselImages, setCarouselImages] = useState<CarouselItem[]>([]);
  const sliderRef = useRef<Slider | null>(null);
  const [vouchers, setVouchers] = useState<Offer[]>([]);
  const [offers, setOffers] = useState([]);


  useEffect(() => {

    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);

    const fetchCategory = async () => {
      try {
        setLoading(false);
        const result = await HomeService.getData();
        setCategories(result?.homePageCategoryImages || []);
      } catch (error) {
        console.error('Error fetching homepage categories:', error);
      }
    };

    const fetchCarousel = async () => {
      try {
        setLoading(false);
        const result = await HomeService.getCarousel();
        const imageLinks = result
          ?.filter((offer: any) => offer?.c_image_link) // optional: remove if all have it
          .map((offer: any) => offer.c_image_link);
        setCarouselImages(imageLinks);
      } catch (error) {
        console.error('Error fetching carousel images:', error);
      }
    };
    
    const fetchVouchers = async () => {
      try {
        setLoading(false);
        const result = await HomeService.getVouchers();
        console.log('res', result);console.log('res', result);
        
        setOffers(result || []);
        setLoading(true);
      } catch (error) {
        console.error('Error fetching carousel images:', error);
      }
    };
    
    fetchCategory();
    fetchCarousel();
    fetchVouchers();
  }, []);

  // if (loading) {
  //   return <LoadingEarnings />;
  // }
  
  // Carousel settings for react-slick
  const settings = {
    infinite: false, // Looping the carousel
    slidesToShow: 10, // Number of slides shown at once
    slidesToScroll: 3, // Number of slides to scroll at once
    arrows: false, // No need for next/prev arrows
    dots: true, // Show dots for navigation
    // centerMode: true, // Center the active slide
    focusOnSelect: true, // Allow focusing on a specific slide when clicked
    speed: 500, // Transition speed
    // draggable: true, // Allow dragging with mouse
    swipeToSlide: true, // Swipe to next slide
    responsive: [
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 4, // 1 slide on small screens
          slidesToScroll: 2,
          dots: false,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 3, // 1 slide on small screens
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8, // 1 slide on small screens
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 8, // 1 slide on small screens
        },
      },
      {
        breakpoint: 765,
        settings: {
          slidesToShow: 8, // 1 slide on small screens
        },
      },
    ],
  };

  // Mouse scroll support
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      sliderRef.current?.slickNext(); // Scroll down
    } else {
      sliderRef.current?.slickPrev(); // Scroll up
    }
  };
  

  const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
      onClick={onClick}
    >
      <FaArrowLeft className="text-gray-700 text-xl" />
    </button>
  );
  
  const NextArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
      onClick={onClick}
    >
      <FaArrowRight className="text-gray-700 text-xl" />
    </button>
  );
  


  // Move this before carousel_settings
  const NxtArrow: React.FC<CustomArrowProps> = ({ onClick }) => {
    return (
      <div className="custom-arrow left-arrow" onClick={onClick}>
        <div className="arrow-icon rotate-180" />
      </div>
    );
  };

  const PreArrow: React.FC<CustomArrowProps> = ({ onClick }) => {
    return (
      <div className="custom-arrow left-arrow" onClick={onClick}>
        <div className="arrow-icon" />
      </div>
    );
  };

  // Now it's safe to use these in carousel_settings
  const carosel_settings = {
    infinite: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dots: true,
    focusOnSelect: true,
    speed: 500,
    draggable: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const carousel_settings = {
    infinite: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true, // Enable default arrows
    dots: true,
    focusOnSelect: true,
    speed: 500,
    draggable: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  
  return (
    <div>
      {/* <Header /> */}

      <div className="px-5 py-6 bg-gray-100 mt-2 mb-2" onWheel={handleWheel}>
        <Slider ref={sliderRef} key={categories.length} {...settings}>
          {categories.map((item, index) => (
            <div key={index} className="flex-shrink-0">
              <div className="flex flex-col items-center category-carousel">
                <div className="flex items-center justify-center shadow-md category">
                  <img src={item.icon} alt={item.name} className='category-img' />
                </div>
                <div className="text-center category-text">
                  <span className="text-sm font-medium cat-txt">{item.name}</span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      
      <div className="d-none carousel-container px-5 py-6 bg-gray-100 mt-2 mb-2" onWheel={handleWheel}>
        <Slider className="carousel-banner" {...carousel_settings}>
          {carouselImages.map((img, index) => (
            <div key={index} className="px-2">
              <img src={img} alt={`carousel-${index}`} className="carousel-img w-full h-auto rounded-lg object-cover" />
            </div>
          ))}
        </Slider>
      </div>

      <div>
        <OfferList offers={offers} />
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Home;
