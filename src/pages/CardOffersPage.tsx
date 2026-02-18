import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeService from "../services/HomeService";

const CardOffersPage: React.FC = () => {
  const { cardType } = useParams();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, [cardType]);

const fetchOffers = async () => {
  try {
    if (!cardType) return;

    const result = await HomeService.searchOffers({
      card_type: cardType.toUpperCase(),  // 👈 IMPORTANT
    });

    setOffers(result || []);
  } catch (error) {
    console.error("Error fetching offers:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ padding: "40px" }}>
      <h2>{cardType?.toUpperCase()} Offers</h2>

      {loading ? (
        <p>Loading...</p>
      ) : offers.length === 0 ? (
        <p>No {cardType} offers available</p>
      ) : (
        offers.map((offer) => (
          <div
            key={offer.offerId}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() =>
              navigate(`/offer-details/${offer.offerId}`, {
                state: { offer },
              })
            }
          >
            <h4>{offer.merchantName}</h4>
            <p>{offer.summary}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CardOffersPage;