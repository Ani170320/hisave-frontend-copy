// src/components/HomeBankSection.tsx

import React, { useEffect, useRef, useState } from "react";
import HomeService from "../services/HomeService";
import { useNavigate } from "react-router-dom";
import "../css/HomeBankSection.css";

interface CardItem {
  name: string;
  icon: string;
}

const HomeBankSection: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

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

      setCards(uniqueCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const bankCards = cards.filter(card => {
    const cleanName = (card.name || "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");

    return (
      cleanName.includes("visa") ||
      cleanName.includes("mastercard") ||
      cleanName.includes("rupay")
    );
  });

  const categories = cards.filter(card => {
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
    sliderRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  const generateFakeNumber = () => {
    return "•••• •••• •••• " + Math.floor(1000 + Math.random() * 9000);
  };

  return (
    <div className="bank-wrapper">

      <div className="bank-group">

        {/* PREMIUM FINTECH CARDS */}
        <div className="bank-cards-row">
          {bankCards.map((card, index) => (
            <div key={index} className="bank-card">

              <h4>{card.name}</h4>

              <div className="card-tier">
                HiSAVE Platinum
              </div>

              <div className="card-number">
                {generateFakeNumber()}
              </div>

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
            <div key={index} className="category-card">
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