import React, { useEffect, useState } from 'react';
import HomeService from '../services/HomeService';
import { Oval } from 'react-loader-spinner';
import '../css/hero.css';

const HeroCarousel = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev =>
          prev === banners.length - 1 ? 0 : prev + 1
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [banners]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const result = await HomeService.getCarousel({});
      setBanners(result || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching carousel:', error);
    }
  };

  const nextSlide = () => {
    setCurrentIndex(prev =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="hero-loader">
        <Oval height="60" width="60" color="#3b82f6" />
      </div>
    );
  }

  if (!banners.length) return null;

  return (
    <div className="hero-container">

      <div className="hero-card">

        <button className="arrow left-arrow" onClick={prevSlide}>
          ‹
        </button>

        <img
          src={banners[currentIndex]?.imageUrl}
          alt="banner"
          className="hero-image"
        />

        <button className="arrow right-arrow" onClick={nextSlide}>
          ›
        </button>

      </div>

    </div>
  );
};

export default HeroCarousel;    