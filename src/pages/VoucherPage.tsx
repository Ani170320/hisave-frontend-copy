import {React, useState, useEffect} from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../context/AuthContext";
import HomeService from '../services/HomeService';
import './VoucherPage.css';

const VoucherPage = () => {
    const [voucherList, setVoucherList] = useState([])
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { uid } = useAuth(); 

    useEffect(() => {    
        window.scrollTo(0, 0);
        fetchDenominations()
    }, []);

    const fetchDenominations = async () => {
        try {
            setLoading(true)
            const payload = {
                uid: uid,
            };

            const result = await HomeService.getUserVoucher(payload);
            
            setVoucherList(result)
            console.log('vouch', voucherList, voucherList.length);
            setLoading(false)
        } catch (error) {
          console.error('Error fetching carousel images:', error);
        }
    };
    
    const copyVoucherRef = (code) => {
        navigator.clipboard.writeText(code)
          .then(() => {
            toast.success('Voucher code copied!');
          })
          .catch(() => {
            toast.error('Failed to copy!');
          });
    };
      
      

    return (
        <div>
      {/* <Header /> */}
      {isLoading ? (
        <div className="loading-overlay">
            <Oval visible={true} height="80" width="80" color="#3b82f6" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" />
        </div>
      ) : (
        <div className="Voucher-page">
            <div className="cart-details-container">
                {/* Back button and title */}
                <div className="back-header" onClick={() => navigate('/')}>
                    <img src="/assets/arrow-left.png" alt="back" className="back-arrow" />
                    <h2 className="cart-title">My Vouchers</h2>
                </div>
                {voucherList.length === 0 ? (
                    <div className='vouchers-empty-section mb-4 mt-4'>
                      <div className='empty-section'>
                        <img src='/assets/empty.png' alt='empty' className='empty-img'/>
                        <div className='explore mt-2' onClick={() => navigate('/')}>
                            <span className='explore-text'>Explore Deals</span>
                        </div>
                      </div>
                    </div>
                    ) : (
                    <div className='vouchers-section mb-4 mt-4'>
                        {voucherList.map((voucher, index) => (
                            <div key={index} className="voucher-card">
                            <div className="voucher-left">
                                <img src="/assets/voucher.png" alt={voucher.brand_name || 'Voucher'} className="brand-logo" />
                                <div>
                                    <h3 className="voucher-title">{voucher.brand_name} Voucher</h3>
                                    <div className="voucher-meta">
                                        <span className="voucher-value">₹ {voucher.sold_price}</span>
                                        <span className="voucher-days">{voucher.validity || '12 months'} Left</span>
                                    </div>
                                </div>
                            </div>

                            <div className="voucher-code-section">
                                <div className="code-txt">Voucher Code</div>
                                <div className='voucher-code'>
                                    <div className="copy-code">
                                        <input type="text" value={voucher.voucher_ref || ''} readOnly className="voucher-code-input" />
                                        <img src="/assets/copy.png" alt="copy" className="copy-btn" onClick={()=> copyVoucherRef(voucher.voucher_ref)} />
                                    </div>
                                    <a href='/'  target='_blank' rel='noopener noreferrer' className='text-decoration-none'>
                                        <div className='redeem-btn'>
                                            <span className="redeem-txt">
                                                Redeem <img src="/assets/redeem.png" alt="Redeem" className="redeem-icon" /> 
                                            </span>
                                        </div>
                                    </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <ToastContainer position="top-right" autoClose={2000} />
            </div>
        </div>  
      )}  
      </div>
    );
};

export default VoucherPage;