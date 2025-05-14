// src/components/footer.tsx
import React from 'react';
import './footer.css';

const Footer = () => {
    
  return (
    <footer className="bg-white text-black px-6 py-10 p-5">
        <div className="footer-container lap-mob-footer flex-col justify-content-between gap-2">
            
            {/* Left Column */}
            <div className="flex flex-col items-start">
                <div className='footer-logo'><img src="/assets/HiSave.png" alt="HiSave Logo" className="mb-4" /></div>
                <div className='lap-view'>
                    <div className='d-flex align-items-center gap-5 mb-4'>
                        <div className=''><img src="/assets/qrcode.png" alt="QR Code" className="w-24 h-24 mb-2" /></div>
                        <div className=''><p className="mb-2">Scan to download</p></div>
                    </div>
                    <div className="d-flex gap-4 mb-4">
                        <div className=''><a href="https://play.google.com/store/apps/details?id=com.hisave.hisaveapp&pcampaignid=web_share&pli=1" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/playstore.png" alt="Google Play" className="app-img w-28" /></a></div>
                        <div className=''><a href="https://apps.apple.com/in/app/hisave/id6448925267" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/appstore.png" alt="App Store" className="app-img w-28" /></a></div>
                    </div>
                </div>
                <div className='mob-view'>
                    <div className="d-flex gap-4 mb-4">
                        <div className=''><a href="https://play.google.com/store/apps/details?id=com.hisave.hisaveapp&pcampaignid=web_share&pli=1" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/playstore.png" alt="Google Play" className="app-img w-28" /></a></div>
                        <div className=''><a href="https://apps.apple.com/in/app/hisave/id6448925267" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/appstore.png" alt="App Store" className="app-img w-28" /></a></div>
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center mb-2'>
                        <div className=''><img src="/assets/qrcode.png" alt="QR Code" className="w-24 h-24 mb-2" /></div>
                        <div className=''><p className="mb-2">Scan to download</p></div>
                    </div>
                </div>

                <p className="mb-2">Follow us on</p>
                <div className="d-flex gap-3 mb-3">
                    <div className=''><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/facebook.png" alt="Facebook" className="w-6 h-6" />
                        </a></div>
                        <div className=''><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/insta.png" alt="Instagram" className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Middle Column */}
            <div className="flex flex-col">
            <h3 className="footer-headtext mb-3">Contact Address</h3>
            <p className="footer-text leading-relaxed mb-4">
                MWIN FINTECH PRIVATE LIMITED <br />
                SOCIETY FOR INNOVATION & <br />
                ENTREPRENEURSHIP - SINE, IIT BOMBAY, INDIA
            </p>
            <p className="footer-text leading-relaxed mb-4">
                Academic Section, 5th Floor, SINE Office,<br />
                SINE, IRCC, IDC - Rahul Bajaj Technology Innovation Centre,<br />
                YP Rd, IIT Area, Powai,<br />
                Mumbai, Maharashtra 400076, India
            </p>
            <p className="footer-headtext mb-3">Contact Number</p>
            <p className="footer-text">+91 95999 98998</p>
            </div>

            {/* Right Column */}
            <div className="right-section flex flex-col items-start text-start text-sm">
                <div className='link-text'>
                    <a href="https://www.gohisave.com/terms-conditions/" target="_blank" rel="noopener noreferrer" className="footer-link  underline">T&C</a><br /><br />
                    <a href="https://www.gohisave.com/hi-team/" target="_blank" rel="noopener noreferrer" className="footer-link underline">About us</a><br /><br />
                    <a href="https://www.gohisave.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="footer-link underline">Privacy policy</a><br /><br />
                </div>
                <p className="mb-1 footer-text text-sm footer-text">Copyright &copy; {new Date().getFullYear()} mWin Fintech Private Limited</p>
                <p className="footer-text text-sm footer-text">Powered by mWin Fintech Private Limited</p>
            </div>

        </div>
        <div className="footer-container tab-footer flex-col justify-content-between gap-8">
            
            {/* Left Column */}
            <div className='d-flex justify-content-between'>
                <div className="flex flex-col items-start">
                    <img src="/assets/HiSave.png" alt="HiSave Logo" className="mb-4" />
                    
                    <div className="d-flex gap-4 mb-4">
                        <div className=''><a href="https://play.google.com/store/apps/details?id=com.hisave.hisaveapp&pcampaignid=web_share&pli=1" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/playstore.png" alt="Google Play" className="app-img w-28" /></a></div>
                        <div className=''><a href="https://apps.apple.com/in/app/hisave/id6448925267" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/appstore.png" alt="App Store" className="app-img w-28" /></a></div>
                    </div>
                    <p className="mb-2">Follow us on</p>
                    <div className="d-flex gap-3">
                    <div className=''><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/facebook.png" alt="Facebook" className="w-6 h-6" />
                        </a></div>
                        <div className=''><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/insta.png" alt="Instagram" className="w-6 h-6" />
                        </a></div>
                    </div>
                </div>
                <div className='align-items-center gap-5 mb-4 text-center'>
                    <div className=''><img src="/assets/qrcode.png" alt="QR Code" className="w-24 h-24" /></div>
                    <div className=''><p className="mb-2">Scan to download</p></div>
                </div>
            </div>

            <div className='d-flex mt-5 justify-content-between'>
                {/*tab left Column */}
                <div className="">
                <h3 className="footer-headtext mb-2">Contact Address</h3>
                <p className="footer-text mb-2">
                    MWIN FINTECH PRIVATE LIMITED <br />
                    SOCIETY FOR INNOVATION & <br />
                    ENTREPRENEURSHIP - SINE, IIT BOMBAY, INDIA
                </p>
                <p className="footer-text mb-4">
                    Academic Section, 5th Floor, SINE Office,<br />
                    SINE, IRCC, IDC - Rahul Bajaj Technology Innovation Centre,<br />
                    YP Rd, IIT Area, Powai,<br />
                    Mumbai, Maharashtra 400076, India
                </p>
                <p className="footer-headtext mb-1">Contact Number</p>
                <p className="footer-text">+91 95999 98998</p>
                </div>

                {/*tab Right Column */}
                <div className="right-section flex flex-col items-start text-start text-sm">
                    <div className='link-text'>
                        <a href="https://www.gohisave.com/terms-conditions/" target="_blank" rel="noopener noreferrer" className="footer-link mb-2 underline">T&C</a><br /><br />
                        <a href="https://www.gohisave.com/hi-team/" target="_blank" rel="noopener noreferrer" className="footer-link mb-2 underline">About us</a><br /><br />
                        <a href="https://www.gohisave.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="footer-link mb-4 underline">Privacy policy</a><br /><br />
                    </div>
                    <p className="mb-1 text-sm footer-text">Copyright &copy; {new Date().getFullYear()} mWin Fintech Private Limited</p>
                    <p className="text-sm footer-text">Powered by mWin Fintech Private Limited</p>
                </div>
            </div>

        </div>
        </footer>


  );
};

export default Footer;
