import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeService from '../services/HomeService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './cardDetails.css'; 


type DenominationType = {
    denominations: number;
    sold_price: number;
    discount_percentage: number;
    product_code: string;
};
  
  

const CardDetails: React.FC = () => {
    const [denomination, setDenomination] = useState<DenominationType[]>([]);
    const [addedItemId, setAddedItemId] = useState<string | null>(null);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [showRedeem, setShowRedeem] = useState(false);
    const [showTnC, setShowTnC] = useState(false);
    const { uid, setUID } = useAuth(); 
    
    const location = useLocation();
    const navigate = useNavigate();
    const { getCount } = useCart();
    const offer = location.state?.offer;
    const redeemLink = offer.redemptionLink;

    let type = ''

    const endDateStr = offer.endDate; // "Wed, 30 Apr 2025 00:00:00 GMT"
    const endDate = new Date(endDateStr);
    const now = new Date();

    const timeDiff = endDate.getTime() - now.getTime();
    const daysLeft = Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0);

    const formattedEndDate = endDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }); // Output: "June 27 2024"

    // Function to segment the list
    const extractSections = (list) => {
        let redeemSection = [];
        let termsSection = [];
        let current = null;
    
        list.forEach((item) => {
        const lowerItem = item.toLowerCase();
    
        if (lowerItem.includes('how to redeem') || lowerItem.includes('steps to redeem') ) {
            current = 'redeem';
            return; // skip heading itself
        } else if (lowerItem.includes('terms & conditions')) {
            current = 'terms';
            return;
        }
    
        if (current === 'redeem') {
            redeemSection.push(item);
        } else if (current === 'terms') {
            termsSection.push(item);
        }
        });
    
        return { redeemSection, termsSection };
    };
    
    // Usage
    const { redeemSection, termsSection } = extractSections(offer.redemptionList || []);
  
    // const redemptionIndex = offer.redemptionList.findIndex(item =>
    //     item.toLowerCase().includes('terms & conditions')
    //   );
      
    // const howToRedeemList = redemptionIndex !== -1 ? offer.redemptionList.slice(0, redemptionIndex) : offer.redemptionList;
    
    // const termsConditionsList = redemptionIndex !== -1 ? offer.redemptionList.slice(redemptionIndex + 1) : [];
      

    if(offer.source == 'vouchers_edenred') {
        type = 'Voucher'
    }
    else {
        type = 'Offer'
    }

    useEffect(() => {    
        console.log('offer', offer, offer.source);
        window.scrollTo(0, 0);
        
    const fetchDenominations = async () => {
        try {
            const payload = {
                brand_name: offer.shortTitle
            };
            const result = await HomeService.getDenominations(payload);
            
            setDenomination(result)
            console.log('vouch', denomination.length);

        } catch (error) {
          console.error('Error fetching carousel images:', error);
        }
      };

      fetchDenominations()
    }, [offer]);
    

    if (!offer) {
        return <div>No offer found.</div>;
    }

    const expandRedeem = () => {
        setShowRedeem(!showRedeem);
    }

    const expandTandC = () => {
        setShowTnC(!showTnC);
    }
    
    const insertCart = async (item: DenominationType) => {
        const updated = { ...quantities, [item.product_code]: 1 };
        setQuantities(updated); // set state
      
        setAddedItemId(item.product_code);
        await sendToCart(item, updated); // Call API after setting state
    };
      
      
    const sendToCart = async (item: DenominationType, updatedQuantities: Record<string, number>) => {
        try {
            const payload = {
                uid: uid,
                item_id: item.product_code,
                quantity: updatedQuantities[item.product_code], // Only the relevant one
                item_price: item.sold_price,
                item_value: item.denominations,
            };
        
            const result = await HomeService.insertCart(payload);
            getCount(); // refresh header cart count

            console.log("Cart insert result:", result);
        } catch (error) {
            console.error("Error inserting into cart:", error);
        }
    };   

    const increaseQty = (productCode: string, item: DenominationType) => {
        const newQty = (quantities[productCode] || 1) + 1;
        const updated = { ...quantities, [productCode]: newQty };
        setQuantities(updated);
        sendToCart(item, updated);
    };
      

    const decreaseQty = (productCode: string, item: DenominationType) => {
        const current = quantities[productCode] || 1;
        const newQty = current - 1;
      
        const updated = { ...quantities };
      
        if (newQty === 0) {
            updated[productCode] = newQty; //delete updated[productCode]; // remove from cart state
        } else {
          updated[productCode] = newQty;
        }
      
        setQuantities(updated);
        sendToCart(item, updated);
    }; 
      
    return (
        <div className="card-details-container">
            {/* Back button and title */}
            <div className="back-header" onClick={() => navigate('/')}>
                <img src="/assets/arrow-left.png" alt="back" className="back-arrow" />
                <h2 className="voucher-title">{type} Details</h2>
            </div>

            {/* Offer Image */}
            <div className="image-container mt-3">
                <img
                src={offer.offerImageLink}
                alt={offer.merchantName}
                className="card-image"
                />
            </div>

            {/* Offer Content */}
            <div className="offer-text-content">
                <h3 className="merchant-name">{offer.merchantName}</h3>
                <p className="offer-summary">{offer.summary}</p>
                <div className='icon-container'>
                    <img src='/assets/heart.png' alt='heart' className='like-img'/>
                    <img src='/assets/share.png' alt='heart' className='share-img'/>
                </div>

                {/* Valid Date Section */}
                <div className="valid-date-section">
                    <span className="valid">Valid til</span>
                    <div className='days-section'>
                        <span className="valid-date-text">{formattedEndDate}</span>
                        <span className="days-left">{daysLeft} days left</span>
                    </div>
                </div>

                {/* {denomination.length > 0 && ( */}
                    <div className='voucher'>
                        {denomination.map((item, index) => (
                            <div key={index}>
                                {/* Desktop View */}
                                <div className="voucher-section mt-4 desktop-only">
                                    <div className="voucher-field">
                                        <span className="voucher-label">Voucher Value</span>
                                        <span className="voucher-value">₹{item.denominations}</span>
                                    </div>
                                    <div className="voucher-field">
                                        <span className="voucher-label">Voucher Price</span>
                                        <span className="voucher-value">₹{item.sold_price}</span>
                                    </div>
                                    <div className="discount-value">
                                        <div className="discount-text">Discount</div>
                                        <div className="discount-no">{item.discount_percentage}%</div>
                                    </div>
                                    <div className="voucher-add-button">
                                        {/* <button className="add-btn" onClick={() => insertCart(item)}>Add</button> */}
                                        {quantities[item.product_code] > 0 ? (
                                            <div className="d-flex qty-controls">
                                                <div onClick={() => decreaseQty(item.product_code, item)}>
                                                    <img src="/assets/minus.png" alt="decrease" className="qty-icon" />
                                                </div>
                                                <div className='qty'>{quantities[item.product_code]}</div>
                                                <div onClick={() => increaseQty(item.product_code, item)}>
                                                    <img src="/assets/add.png" alt="increase" className="qty-icon" />
                                                </div>
                                            </div>
                                            ) : (
                                            <button className="add-btn" onClick={() => insertCart(item)}>Add</button>
                                            )
                                        }
                                    </div>
                                </div>

                                {/* Mobile View */}
                                <div className="mob-voucher-section mt-3 mobile-only">
                                <div className="voucher-top-row">
                                    <div className="mob-voucher-field">
                                    <span className="mob-voucher-label">Voucher Value</span>
                                    <span className="mob-voucher-value">₹{item.denominations}</span>
                                    </div>
                                    <div className="mob-voucher-field">
                                    <span className="mob-voucher-label">Voucher Price</span>
                                    <span className="mob-voucher-value">₹{item.sold_price}</span>
                                    </div>
                                    <div className="voucher-add-button">
                                    {/* <button className="add-btn">Add</button> */}
                                    {quantities[item.product_code] > 0 ? (
                                            <div className="d-flex qty-controls">
                                                <div onClick={() => decreaseQty(item.product_code, item)}>
                                                    <img src="/assets/minus.png" alt="decrease" className="qty-icon" />
                                                </div>
                                                <div className='qty'>{quantities[item.product_code]}</div>
                                                <div onClick={() => increaseQty(item.product_code, item)}>
                                                    <img src="/assets/add.png" alt="increase" className="qty-icon" />
                                                </div>
                                            </div>
                                            ) : (
                                            <button className="add-btn" onClick={() => insertCart(item)}>Add</button>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="voucher-bottom-row">
                                    <div className="discount-value">
                                    <span className="discount-text">Discount</span>
                                    <span className="discount-no">{item.discount_percentage}%</span>
                                    </div>
                                </div>
                                </div>
                            </div>
                        ))}
                    </div>
                {/* )} */}

                {redeemLink != '' && uid && (
                    <a href={redeemLink}  target='_blank' rel='noopener noreferrer' className='mt-2 mb-2 redeem-offer-btn text-decoration-none'>
                        <div className='redeem-offer'>
                            <span className="redeem-offer-txt">
                                Redeem Offer <img src="/assets/offer-redeem.png" alt="Redeem" className="redeem-offer-icon" /> 
                            </span>
                        </div>
                    </a>
                )}

                {/* Redeem Expand Section */}
                <div className="expand-section d-flex flex-column mt-2">
                    <div className="d-flex justify-content-between align-items-center" onClick={() => expandRedeem()}>
                        <span className="expand">How to redeem?</span>
                        <img src='/assets/expand.png' alt='expand' className={`expand-img ${showRedeem ? 'rotate' : ''}`} />
                    </div>

                    {showRedeem && (
                        <div className="expand-content mt-2">
                            <ul className="bullet-list">
                            {redeemSection.map((item: string, index: number) => (
                                <li key={index}>
                                {item.startsWith('http') ? (
                                    <a href={item} target="_blank" rel="noopener noreferrer">
                                    {item}
                                    </a>
                                ) : (
                                    item
                                )}
                                </li>
                            ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* T&C Expand Section */}
                <div className="expand-section d-flex flex-column mt-2">
                    <div className="d-flex justify-content-between align-items-center" onClick={() => expandTandC()}>
                        <span className="expand">Terms & Conditions</span>
                        <img src='/assets/expand.png' alt='expand' className={`expand-img ${showTnC ? 'rotate' : ''}`} />
                    </div>

                    {showTnC && (
                        <div className="expand-content mt-2">
                            {/* <p>{offer.redemptionList}</p> */}
                            <ul className="bullet-list">
                                {termsSection.map((item: string, index: number) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardDetails;
