// OfferList.tsx
import React, { useEffect, useState } from 'react';
import '../css/offerList.css'
import { useNavigate } from 'react-router-dom';


interface Offer {
  sourceImageLink: string;
  offerId: string;
  offerImageLink: string;
  merchantName: string;
  shortTitle: string;
  source: string;
  // summary?: string;
  
  [key: string]: string;
  title:string;
}

interface OfferListProps {
  offers: Offer[];
}

const OfferList: React.FC<OfferListProps> = ({ offers }) => {
  const navigate = useNavigate();  // Create a navigate function
  
  
  useEffect(()=>{
    window.scrollTo(0, 0);
  }, [])

  
  // Function to handle the card click
  const cardDetails = (offer: Offer) => {
    // Navigate to the OfferDetails page, passing the offer as state        
    navigate(`/offer-details/${offer.offerId}`, { state: { offer } });
  };


  return (
    <div className="container py-5">
      <div className="row g-4">
        {offers.map((offer) => {
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
    </div>
  );
};

export default OfferList;
