// src/components/OfferList.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/OfferList.css";

interface Offer {
  offerId: number;
  merchantName: string;
  shortTitle: string;
  offerImageLink: string;
  redemptionLink: string;
  maxSavings?: string;
  validTill?: string;
}

interface Props {
  offers: Offer[];
}

const OfferList: React.FC<Props> = ({ offers }) => {
  const navigate = useNavigate();

  return (
    <div className="offers-container">
      <h2 className="offers-title">Top Offers</h2>

      <div className="offers-grid">
        {offers.map((offer) => (
          <div
            key={offer.offerId}
            className="offer-card"
            onClick={() => navigate(`/offer/${offer.offerId}`)}
          >
            {/* IMAGE SECTION */}
            <div className="offer-image-wrapper">
              <img
                src={offer.offerImageLink}
                alt={offer.merchantName}
                className="offer-image"
              />

              <div className="offer-gradient"></div>

              <div className="offer-badge">HOT DEAL</div>


            </div>

            {/* CONTENT SECTION */}
            <div className="offer-info">

              <p>
                Limited time offer on {offer.merchantName}. Grab now!
              </p>
            </div>

            {/* BOTTOM META */}
            <div className="offer-bottom">
              <div className="offer-meta">
                <span className="meta-label">Max Savings</span>
                <span className="meta-value">
                  {offer.maxSavings || "₹250"}
                </span>
              </div>

              <div className="offer-meta">
                <span className="meta-label">Valid Till</span>
                <span className="meta-value">
                  {offer.validTill || "Mar 2026"}
                </span>
              </div>

              <div className="offer-arrow">→</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferList;