import React, { useEffect, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/CartPage.css'
import HomeService from '../services/HomeService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';


interface CartItem {
  item_id: string;
  item_price: number;
  item_total: number;
  item_value: number;
  quantity: number;
}

interface PaymentTransaction {
  statusCode: string;
  txnId?: string;
  amount?: string;
  errorMessage?: string;
}

interface PaymentMethod {
  paymentTransaction?: PaymentTransaction;
}

interface Response {
  paymentMethod?: PaymentMethod;
}

// Add this at the top of your .tsx or in a .d.ts file
declare global {
  interface Window {
    $: any;
  }
}

const CartPage = () => {
  const [isLoading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { getCount } = useCart();
  const [error, setError] = useState<string | null>(null); // Error message state
  const [confirmError, setConfirmError] = useState<string | null>(null); // Error message state

  const location = useLocation();
  const navigate = useNavigate();
  const { uid, setUID } = useAuth(); 

  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
    whatsapp: ''
  });

  const[recipientData, setRecipientData] = useState({
    recipient_email: '',
    recipient_confirmEmail: '',
    recipient_whatsapp: ''
  });

  const [couponCode, setCouponCode] = useState('')
  const [addons, setAddons] = useState({
    makeGift: false,
    emailCopy: false,
    message: '',
    from: ''
  });

  const [isApplied, setIsApplied] = useState(false);
  const [isError, setIsError] = useState(false);  
  const [isSucccess, setIsSuccess] = useState(false);  
  const [errorMessage, setErrorMessage] = useState(''); 
  const [successMessage, setSuccessMessage] = useState(''); 
  const [isTransaction, setIsTransaction] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isSucced, setIsSucced] = useState(false);
  const [token, setToken] = useState('')
  const [txnId, setTxnId] = useState('')
  const [txnDate, setTxnDate] = useState(''); 


  const totalAmount = (cartItems || []).reduce((sum, item) => sum + (item.item_total || 0), 0);

  const [shoppingAmount, setShoppingAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0)
  
  useEffect(() => {
    const path = location.pathname;
    const status = new URLSearchParams(location.search).get('status');
    if (path.startsWith('/cart') && !status) {
      resetTransactionState();
    }
  }, [location.pathname, location.search]);

  const resetTransactionState = () => {
    setIsTransaction(false);
    setIsFailed(false);
    setIsSucced(false);
    setToken('');
    setTxnId('');
    setTxnDate('');
  };
  

  useEffect(() => {
    // Check the URL for the 'status' query parameter
    setLoading(true)
    const urlParams = new URLSearchParams(location.search);
    const status = urlParams.get('status');
    const txn_id = urlParams.get('tpsl_txn_id');
    const order_id = urlParams.get("order_id")
    const txn_date = urlParams.get('txn_date');
    const msg = urlParams.get('msg')

    if (status == 'aborted' || !status) {
      setLoading(false)
      return; // Only proceed if 'status' exists
    }

    
    if((status=='success' || status=='failed') && msg) {

      const order_payload = {
        "user_order_id": order_id,
        "loyalty_points":null,
        "cashback": null,
        "coupon_code":"PizzHut500",
        "discount_amount": totalDiscount,
        "discount_percentage": discountPercentage,
        "email_address": formData.email,
        "email_ind": 0,
        "gift_from": addons.from,
        "gift_message": addons.message,
        "items_total": totalAmount,
        "make_gift_ind": addons.makeGift ? 1 : 0, 
        "payment_ref": txn_id,
        "payment_status": status == 'success' ? 'paid' : 'failed',
        "total_savings": totalDiscount,
        "uid": uid,
        "whatsapp_number": formData.whatsapp,
        "pg_response": msg
      }
      
      HomeService.updateUserOrder(order_payload);

      const process_payload = {
        "user_order_id": order_id
      }

      HomeService.processPaidOrder(process_payload);

      getCount();
      fetchCartCount()
      
    }

    if (txn_id && txn_date) {
      setTxnId(txn_id);
      setTxnDate(txn_date)
    }

    if (status === 'failed') {
      setIsTransaction(true);
      setIsFailed(true);
    } else if (status === 'success') {
      setIsTransaction(true);
      setIsSucced(true);
    } else {
      setIsTransaction(false);
      setIsSucced(false);
      setIsFailed(false);
    }
    setLoading(false)
  }, [location.search]); // This will trigger the effect when the URL changes

  useEffect(() => {
    if (uid) {
      console.log('uid', uid);
      
      fetchCartCount();
    }
    else {
      console.log('uid', uid);
      
      fetchCartCount();
    }
  }, [uid]);

  const fetchCartCount = async () => {
    try {
      if (!uid) {
        // Prevent API call if uid is invalid
        console.warn('UID is not set. Skipping fetchCartCount.');
        setCartItems([]);
        setCartCount(0);
        setShoppingAmount(0);
        setTotalDiscount(0);
        setDiscountPercentage(0);
        return;
      }
  
      setLoading(true);
  
      const payload = {
        uid: uid,
      };
  
      const result = await HomeService.getCartCount(payload);
      console.log('result', result);
  
      setCartItems(result || []);
      
      let count = 0;
      let amount = 0;
      let discount = 0;
      let originalPrice = 0;
      const items: CartItem[] = [];
  
      if (result) {
        count = result.filter((item: { quantity: number }) => item.quantity > 0).length;
        setCartCount(count);
  
        result.forEach((item) => {
          const qty = item.quantity ?? 0;
          if (qty > 0) {
            const itemTotal = item.item_total ?? 0;
            const itemValue = item.item_value ?? 0;
            const itemTotalValue = itemValue * qty;
  
            amount += itemTotal;
            discount += itemTotalValue - itemTotal;
            originalPrice += itemTotalValue;
  
            items.push(item);
          }
        });
      }
  
      setShoppingAmount(amount);
      setTotalDiscount(discount);
      const discountPercentage = originalPrice > 0 ? (discount / originalPrice) * 100 : 0;
      setDiscountPercentage(parseFloat(discountPercentage.toFixed(2)));
    } catch (error) {
      console.error('Error fetching cart count:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // console.log('form', formData);

    // Check if the email and confirm email match
    if (name === 'confirmEmail') {
      if (formData.email && value && value !== formData.email) {
        setConfirmError("Confirm Email doesn't match");
      } else {
        setConfirmError(null); // Reset error if they match
      }
    }
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecipientData(prev => ({
      ...prev,
      [name]: value
    }));
    // console.log('form', recipientData);
    
    // Check if the email and confirm email match
    if (name === 'recipient_confirmEmail') {
      if (recipientData.recipient_email && value && value !== recipientData.recipient_email) {
        setError("Confirm Email doesn't match");
      } else {
        setError(null); // Reset error if they match
      }
    }
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
    // console.log('coupon', e.target.value);
  };
  

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setAddons(prev => ({
      ...prev,
      [id]: checked
    }));
    // console.log('addons', addons);
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddons((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const increaseQty = (item_id: string) => {
    const updatedCart = cartItems.map((item) =>
      item.item_id === item_id
        ? {
            ...item,
            quantity: item.quantity + 1,
            item_total: (item.quantity + 1) * item.item_price
          }
        : item
    );
    setCartItems(updatedCart);

    
    const updatedItem = updatedCart.find((item) => item.item_id === item_id);
    if (updatedItem) {
      sendToCart(updatedItem, { [item_id]: updatedItem.quantity });
    }
  };
  
  const decreaseQty = (item_id: string) => {
    const updatedCart = cartItems.map((item) =>
      item.item_id === item_id && item.quantity > 0
        ? {
            ...item,
            quantity: item.quantity - 1,
            item_total: (item.quantity - 1) * item.item_price
          }
        : item
    );
    setCartItems(updatedCart);
  
    const updatedItem = updatedCart.find((item) => item.item_id === item_id);
    if (updatedItem) {
      sendToCart(updatedItem, { [item_id]: updatedItem.quantity });
    }
  };

  const sendToCart = async (item: CartItem, updatedQuantities: Record<string, number>) => {
    try {
      // console.log('itm', item);
      setLoading(true)
        const payload = {
          uid: uid,
          item_id: item.item_id,
          quantity: updatedQuantities[item.item_id], // Only the relevant one
          item_price: item.item_price,
          item_value: item.item_value,
        };
    
        await HomeService.insertCart(payload);
        getCount();
        fetchCartCount() // assuming it returns a number
        // console.log("Cart insert result:", result);
    } catch (error) {
      setLoading(false)
        console.error("Error inserting into cart:", error);
    }
  };   
  
  const applyCoupon = (code: string) => {
    // console.log('Applying coupon:', code);
    try {
      const response =  200 //await HomeService.applyCoupon({ couponCode: coupon });

      if (response === 200) {
        // If successful, show the check icon and success message
        setIsApplied(true);
        setIsSuccess(true)
        setSuccessMessage('20% discount')
        setIsError(false);
        setErrorMessage('');
      } else {
        // If there's an error, show the close icon and error message
        setIsApplied(false);
        setIsError(true);
        setErrorMessage('This coupon is not applicable');
      }
    } catch (error) {
      // Handle network or other errors
      setIsApplied(false);
      setIsError(true);
      setErrorMessage('This coupon is not applicable');
    }
  };

  const goToCart = () => {
    setLoading(true)
    navigate('/cart')
    setIsFailed(false)
    setIsSucced(false)
    setIsTransaction(false);
    setToken('')
    setTxnId('')
    setTxnDate('')  
    setLoading(false)
  }

  const handleResponse = (res: Response) => {
    if (res?.paymentMethod?.paymentTransaction?.statusCode) {
      const status = res.paymentMethod.paymentTransaction.statusCode;
  
      if (status === "0300") {
        navigate('/cart')
        // window.location.href = `http://localhost:3000/cart?status=success`;
      } else if (status === "0398") {
        navigate('/')
        // window.location.href = `http://localhost:3000/cart?status=aborted`;
      } else {
        navigate('/')
        // window.location.href = `http://localhost:3000/cart?status=failed`;
      }
    } else {
      navigate('/cart')
      // window.location.href = `http://localhost:3000/cart?status=error`;
    }
  };
  
  
  const callPg = async () => {
    try {
      setLoading(true)
      const insert_payload = {
        "uid": uid,
         "coupon_code":"domino250",
        "items_total": totalAmount,
        "discount_amount": totalDiscount,
        "discount_percentage": discountPercentage,
        "total_savings": totalDiscount,
        "loyalty_points": null,
        "cashback": null,
        "make_gift_ind": addons.makeGift ? 1 : 0,
        "email_ind": 0,
        "email_address": formData.email,
        "whatsapp_number": formData.whatsapp,
        "payment_status":"paid",
        "payment_ref":""
      }
      
      const user_order_id = await HomeService.insertUserOrder(insert_payload);
      const txn_id = 'VP-'+ user_order_id
      
      const token_payload = {
        txn_amount: String(totalAmount.toFixed(1)),
        txn_id: txn_id,
        device: 'web'
      };
  
      const token = await HomeService.generateToken(token_payload);
      setToken(token);
      console.log(shoppingAmount, totalDiscount, totalAmount);
      setLoading(false)
      const reqJson = {
        features: {
          enableAbortResponse: true,
          enableExpressPay: true,
          enableInstrumentDeRegistration: true,
          enableMerTxnDetails: true
        },
        consumerData: {
          deviceId: "WEBSH2",
          token: token,
          returnUrl: "http://localhost:5000/payment-response", // your backend
          // responseHandler: handleResponse,
          paymentMode: "all",
          merchantLogoUrl: "https://www.paynimo.com/CompanyDocs/company-logo-vertical.png",
          merchantId: "T1047901",
          currency: "INR",
          consumerId: "c123",
          txnId: txn_id, // You may use a dynamic ID
          items: [{
            itemId: "first",
            amount: String(totalAmount.toFixed(1)),
            comAmt: "0"
          }],
          customStyle: {
            PRIMARY_COLOR_CODE: "#45beaa",
            SECONDARY_COLOR_CODE: "#FFFFFF",
            BUTTON_COLOR_CODE_1: "#2d8c8c",
            BUTTON_COLOR_CODE_2: "#FFFFFF"
          }
        }
      };
  
      // Call the Paynimo checkout
      if (window.$ && window.$.pnCheckout) {
        window.$.pnCheckout(reqJson);
      } else {
        alert("Paynimo not loaded.");
      }
      
  
    } catch (error) {
      console.error('Error triggering payment gateway:', error);
    }
  };
  

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setIsApplied(false);
    setIsError(false);
    setSuccessMessage('')
    setErrorMessage('');
  };
  

  return (
    <div>
      {isLoading ? (
        <div className="loading-overlay">
            <Oval visible={true} height="80" width="80" color="#3b82f6" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" />
        </div>
      ) : (
        <div className="cart-page">
          <div className="cart-details-container">
            {/* Back button and title */}
            <div className="back-header" onClick={() => navigate('/')}>
                <img src="/assets/arrow-left.png" alt="back" className="back-arrow" />
                <h2 className="cart-title">My Shopping Cart</h2>
            </div>
          
            {(!isTransaction ? (
              <div className='shop-cart mt-5 mb-5'>
                <div className='added-product-section'>
                  <div className="added-header d-flex">
                      <img src="/assets/cart.png" alt="back" className="cart-image" />
                      <p className="cart-title">Added Product Section</p>
                  </div>
                  <div className='added-section'>
                    {cartCount === 0 ? (
                      <div className='empty-section'>
                        {/* <div> */}
                          <img src='/assets/empty.png' alt='empty' className='empty-img'/>
                          <div className='explore mt-2' onClick={() => navigate('/')}>
                            <span className='explore-text'>Explore Deals</span>
                          </div>
                        {/* </div> */}
                      </div>
                    ) : (
                      <div className='cart-voucher'>
                        {cartItems.filter(item => item.quantity > 0).map((item, index) => (
                          <div key={index} className="cart-item p-2">
                            <div className="item-details d-flex justify-content-between gap-2">
                              <div className='voucher-img'>
                                <img src="/assets/voucher.png" alt="vocuher" className="voucher_img" />
                              </div>
                              <div className='vocuher-details'>
                                <p className='voucher-name m-2'>{item.item_id}</p>
                                <p className='voucher-amt m-2'>₹{item.item_price}</p>
                                <p className='voucher-discount m-2'>12% Discount</p>
                              </div>
                            </div>
                            <div className="item-value">
                              <div className="d-flex voucher-controls">
                                <div onClick={() => decreaseQty(item.item_id)}>
                                  <img src="/assets/minus.png" alt="decrease" className="quant-icon" />
                                </div>
                                <div className="quant">{item.quantity}</div>
                                <div onClick={() => increaseQty(item.item_id)}>
                                  <img src="/assets/add.png" alt="increase" className="quant-icon" />
                                </div>
                              </div>
                              {item.quantity > 0 && (
                                <span className="voucher-amt m-2">₹{item.item_total}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {cartCount > 0 && (
                  <><div className='coupon-section'>
                    <div className="added-header d-flex">
                      <img src="/assets/coupon.png" alt="back" className="cart-image" />
                      <p className="cart-title">Apply Coupon</p>
                    </div>
                    <div className='content coupon-content'>
                      <div className='gap-2 d-flex justify-content-between'>
                        <div className='apply-input'>
                          <div className={`input-wrapper ${isError ? 'input-error' : isApplied ? 'input-success' : ''}`}>
                            <input
                              type='text'
                              name='coupon'
                              className='coupon-input'
                              placeholder='Enter Coupon Code'
                              value={couponCode}
                              onChange={handleCouponChange}
                              style={{
                                color: isError ? 'red' : isApplied ? 'green' : 'initial', // Change input text color
                              }}
                            />
                            {isApplied ? (
                              <img src="/assets/check.png" alt="Check" className="apply-input-icon w-24 h-24" />
                            ) : isError ? (
                              <img src="/assets/close.png" alt="Error" className="apply-input-icon w-24 h-24" />
                            ) : null}
                          </div>
                        </div>
                        <div className='apply-btn d-flex justify-content-center' style={{ borderColor: isApplied ? 'red' : 'initial',  cursor: !couponCode ? 'not-allowed' : 'pointer' }}
                          onClick={() => {
                            if (isApplied) {
                              handleRemoveCoupon();  // 👈 handle reset
                            } else {
                              applyCoupon(couponCode);
                            }
                          }}>
                          <span className='apply-txt' style={{ color: isApplied ? 'red' : 'black', opacity: !couponCode ? 0.5 : 1  }} >
                            {isApplied ? 'Remove' : 'Apply'}
                          </span>
                        </div>
                      </div>
                      {isSucccess && (
                        <div className="success-message">
                          <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%' }}>
                            {successMessage}
                          </span>
                        </div>
                      )}
                      {isError && (
                        <div className="error-message">
                          <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '12px', lineHeight: '100%', letterSpacing: '0%' }}>
                            {errorMessage}
                          </span>
                        </div>
                      )}
                    </div>
                    
                  </div>
                  <div className='addon-section'>
                    <div className='form-section'>
                      <div className="input-wrapper me-2">
                        <span className='form-txt'>Your email address</span>
                        <div className="input-with-icon">
                          <input type='email' name='email' className='custom-input' placeholder='yourmail@domain.com' value={formData.email} onChange={handleChange}/>
                          <img src="/assets/email-icon.png" alt="email" className="input-icon" />
                        </div>
                      </div>
                      <div className="input-wrapper me-2">
                        <span className='form-txt'>Confirm email address</span>
                        <div className="input-with-icon">
                          <input type='email' className='custom-input' name='confirmEmail' placeholder='Enter The Email address ' value={formData.confirmEmail} onChange={handleChange}/>
                          <img src="/assets/email-icon.png" alt="email" className="input-icon" />
                        </div>
                        {confirmError && <div className="error-message">{confirmError}</div>}
                      </div>
                      <div className="input-wrapper me-2">
                        <span className='form-txt'>Whatsapp</span>
                        <div className="input-with-icon">
                          <input type='tel' className='custom-input' name='whatsapp' placeholder='+91 1234567987' value={formData.whatsapp} onChange={handleChange}/>
                          <img src="/assets/whatsapp.png" alt="whatsapp" className="input-icon" />
                        </div>
                      </div>
                    </div>
                    <div className='user-section mt-4'>
                      <p className='add-headers'>Add-ons</p>
                      <div className='form-check d-flex gap-2 p-0'>
                        <input className='form-input' type='checkbox' id='makeGift' checked={addons.makeGift} onChange={handleCheckboxChange} />
                        <label className='form-label' htmlFor='makeGift'>
                          Make it a gift
                        </label>
                      </div>
                        
                      {addons.makeGift && (
                        <div className='gift-message mt-2 mb-3'>
                          <label className='form-text mb-1'>Personalized Message</label>
                          <textarea className='msg-form' placeholder='Enjoy your gift💖' name='message' value={addons.message} onChange={handleInputChange} />

                          <label className='form-text mt-2 mb-1'>From</label>
                          <input className='from-form' type='text' name='from' value={addons.from} onChange={handleInputChange} />
                        </div>
                      )}
                      <div className='form-check d-flex gap-2 p-0'>
                        <input className='form-input' type='checkbox' id='emailCopy' checked={addons.emailCopy} onChange={handleCheckboxChange} />
                        <label className='form-label' htmlFor='emailCopy'>
                          Email a copy of your gift message upon delivery
                        </label>
                      </div>
                      {addons.emailCopy && (
                        <div className='form-section'>
                          <div className="input-wrapper me-2">
                            <span className='form-txt'>Recipient's email address</span>
                            <div className="input-with-icon">
                              <input type='email' name='recipient_email' className='custom-input' placeholder='yourmail@domain.com' value={recipientData.recipient_email} onChange={handleRecipientChange}/>
                              <img src="/assets/email-icon.png" alt="email" className="input-icon" />
                            </div>
                          </div>
                          <div className="input-wrapper me-2">
                            <span className='form-txt'>Confirm Recipient's email address</span>
                            <div className="input-with-icon">
                              <input type='email' className='custom-input' name='recipient_confirmEmail' placeholder='Enter The Email address ' value={recipientData.recipient_confirmEmail} onChange={handleRecipientChange}/>
                              <img src="/assets/email-icon.png" alt="email" className="input-icon" />
                            </div>
                            {error && <div className="error-message">{error}</div>}
                          </div>
                          <div className="input-wrapper me-2">
                            <span className='form-txt'>Whatsapp</span>
                            <div className="input-with-icon">
                              <input type='tel' className='custom-input' name='recipient_whatsapp' placeholder='+91 1234567987' value={recipientData.recipient_whatsapp} onChange={handleRecipientChange}/>
                              <img src="/assets/whatsapp.png" alt="whatsapp" className="input-icon" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div></>
                )}

                <div className='bill-section'>
                  <div className="added-header d-flex">
                    <img src="/assets/receipt.png" alt="back" className="cart-image" />
                    <p className="cart-title">Bill Details</p>
                  </div>
                  <div className='content'>
                    <div className='items d-flex justify-content-between'>
                      <span className='bill-text'>Items Total</span>
                      <span className='amt-text'>
                        {cartCount > 0 ? `₹${totalAmount}` : '₹---'}
                      </span>
                    </div>
                    <div className='discount d-flex justify-content-between'>
                      <div>
                        <span className='bill-text'>Total Discount</span>
                      </div>
                      <div>
                        {/* <span className='disc-text me-2'>
                          {cartCount > 0 ? '---%' : '%---'}
                        </span> */}
                        <span className='amt-text'>
                        {cartCount > 0 ? `₹${totalDiscount}` : '₹---'}</span>
                      </div>
                    </div>
                    {cartCount > 0 && (
                      <>
                      <img src="/assets/wave-mob.png" alt="back" className="wave-image mob-wave" />
                      <img src="/assets/wave.png" alt="back" className="wave-image wave" />
                      <span className='save-amt'>You Saved ₹{totalDiscount} </span></>
                    )}
                  </div>
                </div>
                
                <div className='earn-section d-none'>
                  <div className="added-header d-flex">
                      <img src="/assets/earn.png" alt="back" className="cart-image" />
                      <p className="cart-title">You'll Earn</p>
                    </div>
                    <div className='content'>
                      <div className='items d-flex justify-content-between'>
                        <span className='bill-text'>Loyality Points</span>
                        <span className='amt-text'>₹---</span>

                      </div>
                      <div className='discount d-flex justify-content-between'>
                        <div>
                          <span className='bill-text'>Cashback</span>
                        </div>
                        <div>
                          <span className='amt-text'>₹---</span>
                        </div>
                      </div>
                    </div>
                </div>
                
                {cartCount > 0 && (<div className='continue-section' onClick={() => callPg()}>
                    {uid ? (<span>₹{totalAmount} Complete payment</span>) : (<span>Login to Continue</span>)}
                </div>)}
              </div>) : (
                <div className='transaction-section mt-5 mb-5'>
                  {/* transaction failed div */}
                  {isFailed && (
                    <div className='w-100'>
                    <div className='complete-section'>
                      <div className='success-img-container'>
                        <div className="failed-animation">
                          <img src="/assets/failed.png" alt="failed" className="failed-img" />
                        </div>
                      </div>

                    {/* <div className='complete-txt-container'> */}
                      <div className='complete-txt'>Transaction Failed!</div>
                    {/* </div> */}
                    </div>
                    <div className='d-flex justify-content-center mt-3'>
                      <span className='payment-txt'>Great Username! your transaction have been completed. </span>
                    </div>
                    <div className="pay-details mt-3">
                      {/* <div className="detail-label">Paid Via</div>
                      <div className="detail-value">Credit Card</div> */}

                      <div className="detail-label">Time</div>
                      <div className="detail-value">{txnDate}</div>
                    </div>

                    <div className='trans-btn mt-3'>
                      <div className='home-btn' onClick={ () => navigate('/')}>
                        <span className='home-txt'>Try again</span>
                      </div>
                      <div className='voucher-btn' onClick={ () => goToCart()}>
                        <span className='voucher-txt'>Go to Cart</span>
                      </div>
                    </div>
                  </div>
                  )}

                  {/* transaction completed div */}
                  {isSucced && (
                    <div className='w-100'>
                      <div className='complete-section'>
                        <div className='success-img-container'>
                          <div className="success-animation">
                            <img src="/assets/round.png" alt="round" className="round-img" />
                            <img src="/assets/tick.png" alt="tick" className="tick-img" />
                          </div>
                        </div>

                      {/* <div className='complete-txt-container'> */}
                        <div className='complete-txt'>Transaction Complete</div>
                      {/* </div> */}
                      </div>
                      <div className='d-flex justify-content-center mt-3'>
                        <span className='payment-txt'>Great Username! your transaction have been completed. </span>
                      </div>
                      <div className="pay-details mt-3">
                        <div className="detail-label">Paid Via</div>
                        <div className="detail-value">Credit Card</div>

                        <div className="detail-label">Transaction ID</div>
                        <div className="detail-value">{txnId}</div>

                        <div className="detail-label">Time</div>
                        <div className="detail-value">{txnDate}</div>
                      </div>

                      <div className='trans-btn mt-3'>
                        <div className='home-btn' onClick={ () => navigate('/')}>
                          <span className='home-txt'>Go to Home Page</span>
                        </div>
                        <div className='voucher-btn' onClick={ () => navigate('/voucher')}>
                          <span className='voucher-txt'>My Vouchers</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            

          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;