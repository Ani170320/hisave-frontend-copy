// src/components/HomeBankSection.tsx

import React, { useEffect, useRef, useState } from "react";
import HomeService from "../services/HomeService";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import "../css/HomeBankSection.css";

interface CardItem {
  name: string;
  icon: string;
}

const HomeBankSection: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

  const { setSearchTerm, setShowSearchResults } = useSearch();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const result = await HomeService.getData();
      const rawCards = result?.homePageCategoryImages || [];

      const uniqueCards = rawCards.filter(
        (value: any, index: number, self: any[]) =>
          index === self.findIndex((t: any) => t.name === value.name)
      );

      const filteredCards = uniqueCards.filter((card: any) => {
        const cleanName = (card.name || "")
          .toLowerCase()
          .replace(/[^a-z]/g, "");

        return (
          !cleanName.includes("hisave") &&
          !cleanName.includes("exclusive")
        );
      });

      setCards(filteredCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const handleCardClick = (cardName: string) => {
    const cleanName = (cardName || "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");

    let cardType = "";

    if (cleanName.includes("visa")) cardType = "visa";
    else if (cleanName.includes("mastercard")) cardType = "mastercard";
    else if (cleanName.includes("rupay")) cardType = "rupay";

    if (cardType) navigate(`/offers/${cardType}`);
  };

  // 🔥 Category → Search flow
  const handleCategoryClick = (categoryName: string) => {
    setSearchTerm(categoryName);
    setShowSearchResults(true);
    navigate("/search");
  };

  const bankCards = cards.filter((card) => {
    const cleanName = (card.name || "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");

    return (
      cleanName.includes("visa") ||
      cleanName.includes("mastercard") ||
      cleanName.includes("rupay")
    );
  });

  const categories = cards.filter((card) => {
    const cleanName = (card.name || "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");

    return (
      !cleanName.includes("visa") &&
      !cleanName.includes("mastercard") &&
      !cleanName.includes("rupay")
    );
  });

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="bank-wrapper">
      <div className="bank-group">

        {/* HERO SECTION */}
        <div className="bank-hero">
          <p className="bank-subtitle">
            <span className="brand-hi">Hi</span>
            <span className="brand-save">SAVE</span>
            : Pioneering Solution for Consumers & Merchants.
          </p>

          <h2 className="bank-title">Enjoy Savings</h2>

          <p className="bank-description">
            Exciting Deals on your cards!
          </p>
        </div>

        {/* BANK CARDS */}
        <div className="bank-cards-row">
          {bankCards.map((card, index) => (
            <div
              key={index}
              className="bank-card"
              onClick={() => handleCardClick(card.name)}
            >
              <h4>{card.name}</h4>
              <div className="card-bottom-row">
                <div className="card-chip"></div>
                <img src={card.icon} alt={card.name} />
              </div>
            </div>
          ))}
        </div>

        <button
          className="bank-reveal-btn"
          onClick={() => navigate("/hisave-ai")}
        >
          Reveal my offer
        </button>
      </div>

      {/* CATEGORY SLIDER */}
      <div className="categories-wrapper">
        <button className="slider-btn left" onClick={scrollLeft}>
          ‹
        </button>

        <div className="categories-row" ref={sliderRef}>
          {categories.map((card, index) => (
            <div
              key={index}
              className="category-card"
              onClick={() => handleCategoryClick(card.name)}
              style={{ cursor: "pointer" }}
            >
              <img src={card.icon} alt={card.name} />
              <span>{card.name}</span>
            </div>
          ))}
        </div>

        <button className="slider-btn right" onClick={scrollRight}>
          ›
        </button>
      </div>
    </div>
  );
};

export default HomeBankSection;