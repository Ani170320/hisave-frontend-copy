import React, { useState } from 'react';
import { Oval } from 'react-loader-spinner';
import HomeService from '../services/HomeService'; // adjust this import
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './LoginPage.css';

const LoginPopup = ({ onClose }) => {
    const [mobile, setMobile] = useState('');
    const { uid, setUID } = useAuth(); 
    const [userid, setUserid] = useState(''); 
    
    const { getCount } = useCart();
    const [consent, setConsent] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState(Array(4).fill(''));
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false)
    const isValidMobile = mobile.length === 10;

    const handleContinue = async () => {
        try {
            setLoading(true)
            const payload = { 
                "mobileNumber": mobile,
                "encKey":"8g1wb+yRa2S"
            };
            const result = await HomeService.loginUser(payload);
            console.log('result', result);

            if (result?.uid) {
                setUserid(result.uid);
                setLoading(false)
                setShowOtpModal(true);
            } else {
                setLoading(false)
                alert('Invalid mobile number or user not found.');
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Error:', error);
        }
    };

    const handleOtpChange = (index, value) => {
        if (/^\d?$/.test(value)) {
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
        }
    };

    const handleOtpSubmit = async () => {
        setLoading(true)
        const fullOtp = otp.join('');
        if (fullOtp.length === 4) {
        const otp_payload = {
            uid: userid,
            otp: fullOtp,
        };

        try {
            const result = await HomeService.confirmOTP(otp_payload);

            if (result?.uid) {
                
                localStorage.setItem('uid', result.uid);
                const storedUid = localStorage.getItem('uid'); // Or sessionStorage.getItem(...)
                if (storedUid) {
                  setUID(storedUid);
                }                
                setLoading(false)
                getCount()
                onClose(); // ✅ Close the modal
                window.location.reload(); // hard reload the page
            } else {
                setLoading(false)
                setError('Invalid OTP'); // ❌ Show error message
            }
        } catch (err) {
            setLoading(false)
            console.error(err);
            setError('Something went wrong. Please try again.');
        }
        } else {
        setError('Please enter all 4 digits of OTP');
        }
    };


    const handleResendOtp = async () => {
        console.log('Resending OTP to:', mobile);
        try {
            setLoading(true)
            setOtp(['', '', '', '']);
            const payload = { 
                "mobileNumber": mobile,
                "encKey":"8g1wb+yRa2S"
            };
            const result = await HomeService.loginUser(payload);
            console.log('result', result);

            if (result?.uid) {
                setUID(result?.uid)
                setLoading(false)
                setShowOtpModal(true);
            } else {
                setLoading(false)
                alert('Invalid mobile number or user not found.');
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Error:', error);
        }
    };

    return (
        <div className="modal-overlay">
            {!isLoading && (
                <div className="login-modal">
                    <div className="login-header">
                        <span className="login-head">
                            {showOtpModal ? 'Verify OTP' : 'Login with your mobile'}
                        </span>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>

                    {!showOtpModal ? (
                    <div className="login-body">
                        <label className="mobile-label">Mobile</label>
                        <div className="mobile-input">
                        <img src="/assets/call.png" alt="email" className="call-icon" />
                        <span className="country-code">+91</span>
                        <input
                            type="text"
                            className="mobile-input-box"
                            placeholder="Enter mobile"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                            maxLength={10}
                        />
                        </div>

                        <div className="consent-text">
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                        />
                        <span>
                            By entering credentials, I consent to
                            <a href="https://www.gohisave.com/terms-conditions/" target="_blank" rel="noopener noreferrer"> TnCs </a> and
                            <a href="https://www.gohisave.com/privacy-policy" target="_blank" rel="noopener noreferrer"> Privacy Statement </a> of the organization
                        </span>
                        </div>

                        <button className={`continue-btn ${isValidMobile && consent ? 'enabled' : 'disabled'}`}
                            disabled={!(isValidMobile && consent)} onClick={handleContinue} >
                        Continue
                        </button>

                        <div className="divider d-none">or</div>

                        <div className="d-none social-login">
                        <button className="google-btn">Google</button>
                        <button className="apple-btn">Apple</button>
                        </div>

                        <div className="payment-logos">
                            <img src="/assets/mastercard.png" className='mc-logo' alt="Mastercard" />
                            <img src="/assets/visa.png" className='visa-logo' alt="Visa" />
                            <img src="/assets/rupay.png" className='rupay-logo' alt="RuPay" />
                            <img src="/assets/amex.png" className='amex-logo' alt="Amex" />
                            <img src="/assets/discover.png" className='discover-logo' alt="Discover" />
                        </div>
                    </div>
                    ) : (
                    <div className="otp-body center">
                        <p>Enter 4 digit OTP sent to your mobile</p>
                        <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            />
                        ))}
                        </div>
                        {error && <p className="error-message">{error}</p>}

                        <button className="resend-otp" onClick={handleResendOtp}>
                            ↻ Resend OTP
                        </button>

                        <button className={`continue-btn ${otp.every(digit => digit !== '') ? 'enabled' : 'disabled'}`}
                            disabled={!(otp.every(digit => digit !== ''))}  onClick={handleOtpSubmit}>
                            Continue
                        </button>
                    </div>
                    )}
                </div>
            )}
            {isLoading && (
                <div className="loading-overlay">
                    <Oval
                    visible={true}
                    height="80"
                    width="80"
                    color="#3b82f6"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    />
                </div>
            )}
        </div>
    );
};

export default LoginPopup;
