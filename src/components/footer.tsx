import React, { useEffect, useState, useRef } from 'react';
import '../css/footer.css';

const Footer = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`hisave-footer ${isIntersecting ? 'footer-animate-in' : 'footer-hidden'}`}
    >
      <button
        className="floating-back-btn"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="footer-main-container">

        {/* Column 1: Brand */}
        <div className="footer-section brand-col">
          <img
            src="/assets/HiSave.png"
            alt="HiSave"
            className="footer-logo-img"
          />

          <div className="download-area-clean">
            <div className="qr-box-simple">
              <img src="/assets/qrcode.png" alt="QR" />
              <p>Scan to App</p>
            </div>

            <div className="store-stack-simple">
              <a
                href="https://play.google.com/store/apps/details?id=com.hisave.hisaveapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/assets/playstore.png" alt="Play Store" />
              </a>

              <a
                href="https://apps.apple.com/in/app/hisave/id6448925267"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/assets/appstore.png" alt="App Store" />
              </a>
            </div>
          </div>

          <div className="social-column">
            <p className="journey-text">Follow our journey</p>

            <div className="social-row">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/facebook.png"
                  alt="Facebook"
                  className="static-social"
                />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/insta.png"
                  alt="Instagram"
                  className="static-social"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Address */}
        <div className="footer-section address-col">
          <h4 className="footer-heading-large">Headquarters</h4>

          <p className="full-address">
            L25, Ridgewood Estate, DLF 4,<br />
            Near Galleria Market, Gurgaon 122009, India
          </p>

          <p className="full-address">
            YP Rd, IIT Area, Powai,<br />
            Mumbai, Maharashtra 400076, India
          </p>

          <div className="contact-box-clean">
            <p className="support-label-regular">Support Line</p>
            <p className="phone-regular">+91 95999 98998</p>
          </div>
        </div>

        {/* Column 3: Links */}
        <div className="footer-section links-col">
          <nav className="nav-list-premium">
            <a
              href="https://www.gohisave.com/hi-team/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-animated"
            >
              About Us
            </a>

            <a
              href="https://www.gohisave.com/terms-conditions/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-animated"
            >
              Terms & Conditions
            </a>

            <a
              href="https://www.gohisave.com/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-animated"
            >
              Privacy Policy
            </a>

            <a
              href="https://www.gohisave.com/refund-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-animated"
            >
              Refund & Cancellation Policy
            </a>
          </nav>
        </div>

      </div>

      <div className="footer-bottom-strip">
        <p>
          © {new Date().getFullYear()} mWin Fintech Private Limited. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;