import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitleSetter = () => {
  const location = useLocation();

  useEffect(() => {
    let title = 'HiSave';

    if (location.pathname === '/') {
        title = 'Home';
    } else if (location.pathname.startsWith('/offer-details')) {
        title = 'Offer Details';
    } else if (location.pathname === '/voucher') {
        title = 'My Voucher';
    }

    document.title = title;
  }, [location]);

  return null;
};

export default PageTitleSetter;
