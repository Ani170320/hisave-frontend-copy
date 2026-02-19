import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import HomeService from '../services/HomeService';
import { Oval } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import '../css/offerList.css';

interface Offer {
  sourceImageLink: string;
  offerId: string;
  offerImageLink: string;
  merchantName: string;
  shortTitle: string;
  source: string;
  summary?: string;
  title: string;
}

const SearchList = ({ onBack }) => {
  const { searchTerm, setShowSearchResults } = useSearch();
  const { uid, user } = useAuth();
  const navigate = useNavigate();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!searchTerm) return;
    fetchOffers();
  }, [searchTerm]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError('');

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;

      const search_payload = {
        searchPhrase: searchTerm,
        banks: [],
        cardNetworks: [],
        lat: latitude.toString(),
        long: longitude.toString(),
        user_country: "India",
        paymentMethods: user?.pmt_methods || [],
        uid: uid ? uid : "Not Logged in Web User",
      };

      const search_data = await HomeService.searchOffers(search_payload);
      setOffers(search_data || []);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Unable to fetch offers.');
    } finally {
      setLoading(false);
    }
  };

  const cardDetails = (offer: Offer) => {
    navigate(`/offer-details/${offer.offerId}`, { state: { offer } });
  };

  return (
    <div className="search-container">

      {/* BACK BUTTON */}
      <div
        className="search-back"
        onClick={() => {
          setShowSearchResults(false);
          onBack();
        }}
      >
        <img src="/assets/arrow-left.png" alt="back" className="back-arrow" />
        <h2 className="search-title">Search Results</h2>
      </div>

      {isLoading ? (
        <div className="loading-overlay">
          <Oval
            visible={true}
            height="70"
            width="70"
            color="#004A7F"
            ariaLabel="oval-loading"
          />
        </div>
      ) : (
        <div className="offers-grid">

          {offers.length === 0 && !error && (
            <p className="no-results">
              No offers found for "<strong>{searchTerm}</strong>"
            </p>
          )}

          {error && <p className="error-text">{error}</p>}

          {offers
            .filter((offer) => offer.source?.toLowerCase() !== 'vouchers_edenred')
            .map((offer) => (
              <div
                key={offer.offerId}
                className="offer-card"
                onClick={() => cardDetails(offer)}
              >
                <div className="offer-image-wrapper">
                  <img
                    src={offer.offerImageLink}
                    alt={offer.title}
                    className="offer-image"
                  />

                  <img
                    src={offer.sourceImageLink}
                    alt="source"
                    className="source-badge"
                  />
                </div>

                <div className="offer-content">
                  <h3 className="offer-title">
                    {offer.merchantName}
                  </h3>

                  <p className="offer-description">
                    {offer.summary || "Exciting offer available now."}
                  </p>
                </div>
              </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default SearchList;