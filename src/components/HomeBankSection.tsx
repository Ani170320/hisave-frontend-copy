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

      // Remove duplicates only
      const uniqueCards = rawCards.filter(
        (value: any, index: number, self: any[]) =>
          index === self.findIndex((t: any) => t.name === value.name)
      );

      // IMPORTANT: Do NOT filter out "all" or "best"
      setCards(uniqueCards);

    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };
  

  // Strong & safe bank filter
  const bankCards = cards.filter(card => {
    const name = card.name?.toLowerCase() || "";
    return (
      name.includes("visa") ||
      name.includes("mastercard") ||
      name.includes("rupay")
    );
  });

  const categories = cards.filter(card => {
    const name = card.name?.toLowerCase() || "";
    return (
      !name.includes("visa") &&
      !name.includes("master") &&
      !name.includes("rupay")
    );
  });

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  return (
    <div className="bank-wrapper">

    {/* BANK SECTION */}
<div className="bank-group">

  {/* Bank Logos inside green container */}
  <div className="bank-logos-container">
    {bankCards.map((card, index) => (
      <div key={index} className="bank-logo-item">
        <img src={card.icon} alt={card.name} />
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