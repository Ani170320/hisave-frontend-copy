import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import HomeService from '../services/HomeService';
import { Oval } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import '../css/offerList.css'

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
    } catch (error) {
      console.error('Error fetching offers:', error);
      setError('Unable to fetch offers.');
    } finally {
      setLoading(false);
    }
  };

  const cardDetails = (offer: Offer) => {
    navigate(`/offer-details/${offer.offerId}`, { state: { offer } });
  };

  return (
    <div className="container py-5">
      
      {/* 🔥 BACK BUTTON FIXED */}
      <div
        className="search-back"
        onClick={() => {
          setShowSearchResults(false);
          onBack();
        }}
      >
        <img src="/assets/arrow-left.png" alt="back" className="back-arrow" />
        <h2 className="cart-title">Search Result</h2>
      </div>

      {isLoading ? (
        <div className="loading-overlay">
          <Oval
            visible={true}
            height="80"
            width="80"
            color="#3b82f6"
            ariaLabel="oval-loading"
          />
        </div>
      ) : (
        <div className="row g-4 mt-2">

          {offers.length === 0 && !error && (
            <p>No offers found for "{searchTerm}"</p>
          )}

          {error && <p>{error}</p>}

          {offers
            .filter((offer) => offer.source?.toLowerCase() !== 'vouchers_edenred')
            .map((offer) => (
              <div key={offer.offerId} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm overflow-hidden rounded-3">
                  <div
                    className="d-flex w-100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => cardDetails(offer)}
                  >
                    <img
                      src={offer.offerImageLink}
                      alt={offer.title}
                      className="offer-image rounded-3 card-align"
                    />

                    <img
                      src={offer.sourceImageLink}
                      alt={offer.title}
                      className="source-image mt-2 ms-2 card-align"
                    />

                    <div className="p-3 d-flex flex-column text-style">
                      <h5 className="offer-title mb-2">
                        {offer.merchantName}
                      </h5>

                      <p
                        className="offer-text mb-2"
                        style={{ maxHeight: '70px', overflow: 'hidden' }}
                      >
                        {offer.summary}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchList;  