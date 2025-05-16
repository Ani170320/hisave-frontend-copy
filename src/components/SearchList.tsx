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
  [key: string]: string;
  title:string;
}

const SearchList = ({ onBack }) => {
  const { searchTerm } = useSearch();
  const { uid, user } = useAuth();

  const [offers, setOffers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!searchTerm) return;
    fetchOffers();
  }, [searchTerm]);

  const fetchOffers = async () => {
    try {
      // Get current location from the browser
      setLoading(true)
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
        paymentMethods: user.pmt_methods,
        uid: uid ? uid : "Not Logged in Web User",
      };
  
      const search_data = await HomeService.searchOffers(search_payload);
      setOffers(search_data);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching offers or getting location:', error);
      setLoading(false)
    }
  };
  
  const navigate = useNavigate();  // Create a navigate function
  
    
  // Function to handle the card click
  const cardDetails = (offer: Offer) => {
    // Navigate to the OfferDetails page, passing the offer as state        
    navigate(`/offer-details/${offer.offerId}`, { state: { offer } });
  };

  return (
    <div className="container py-5">
      <div className="search-back" onClick={onBack}>
          <img src="/assets/arrow-left.png" alt="back" className="back-arrow" />
          <h2 className="cart-title">Search Result</h2>
      </div>
      {isLoading ? (
        <div className="loading-overlay">
            <Oval visible={true} height="80" width="80" color="#3b82f6" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" />
        </div> ) : (    
        <div className="row g-4 mt-2">
          
      {offers.length === 0 && !error && (
        <p>No offers found for "{searchTerm}"</p>
      )}
          {offers.filter((offer) => offer.source?.toLowerCase() !== 'vouchers_edenred').map((offer) => {
            const hasCashback = offer.summary?.toLowerCase().includes('cashback');
            const hasVouchers = offer.source?.toLowerCase().includes('vouchers_edenred');

            return (
              <div key={offer.offerId} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm overflow-hidden rounded-3">
                  <div className="d-flex w-100" style={{ cursor: 'pointer' }}  onClick={() => cardDetails(offer)}>
                    {/* Image section */}
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
                    {/* Right content */}
                    <div className="p-3 d-flex flex-column justify-content-start text-style" >
                      {/* Merchant name */}
                      <h5 className="offer-title mb-2">{offer.merchantName}</h5>

                      {/* Short title */}
                      <p className="offer-text mb-2" style={{ maxHeight: '70px', overflow: 'hidden' }}>
                        {offer.summary}
                      </p>

                      {/* Cashback badge */}
                      {/* {hasVouchers && (
                        <div className="cash-badge mt-2 align-self-start">
                            <span className="cash-text">Up to 95% Cashback</span>
                        </div>
                      )}

                      {hasVouchers && (
                        <div className="voucher-badge mt-2 align-self-start">
                          <span className="voucher-text">Voucher</span>
                        </div>
                      )} */}
                      
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchList;
