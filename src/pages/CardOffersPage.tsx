import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeService from "../services/HomeService";
import { useAuth } from "../context/AuthContext";
import "../css/CardOffersPage.css";

const CardOffersPage: React.FC = () => {
  const { cardType } = useParams();
  const navigate = useNavigate();
  const { uid } = useAuth();

  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cardType && uid) {
      fetchOffers();
    }
  }, [cardType, uid]);

  const fetchOffers = async () => {
    try {
      setLoading(true);

      const payload = {
        searchPhrase: cardType,   // IMPORTANT
        banks: [],
        cardNetworks: [],
        lat: 19.08201,
        long: 72.8344683,
        uid: uid,
        user_country: "India"
      };

      console.log("🔥 Category Payload:", payload);

      const result = await HomeService.searchOffers(payload);

      setOffers(Array.isArray(result) ? result : []);

    } catch (error) {
      console.error("Error fetching offers:", error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="offers-page">
      <div className="offers-header">
        <h2>{cardType?.toUpperCase()} Offers</h2>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : offers.length === 0 ? (
        <p className="no-offers">
          No {cardType?.toUpperCase()} offers available
        </p>
      ) : (
        <div className="offers-grid">
          {offers.map((offer: any) => (
            <div
              key={offer.offerId}
              className="offer-card"
              onClick={() =>
                navigate(`/offer-details/${offer.offerId}`, {
                  state: { offer },
                })
              }
            >
              <div className="offer-left">
                <div className="offer-badge">POPULAR</div>

                <h4 className="offer-title">
                  {offer.merchantName}
                </h4>

                <p className="offer-summary">
                  {offer.summary}
                </p>

                <div className="offer-footer">
                  <span className="offer-date">
                    Valid till {formatDate(offer.endDate)}
                  </span>
                  <span className="offer-network">
                    {cardType?.toUpperCase()}
                  </span>
                </div>
              </div>

              {offer.offerImageLink && (
                <div className="offer-right">
                  <img
                    src={offer.offerImageLink}
                    alt={offer.merchantName}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardOffersPage;