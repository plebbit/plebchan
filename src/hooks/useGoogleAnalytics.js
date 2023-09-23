import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = "G-2M2VYEFL7B"; 

const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      const fullPath = location.pathname + location.search + location.hash;
      window.gtag('config', GA_MEASUREMENT_ID, {
        'page_path': fullPath,
      });
    }
  }, [location]);
};

export default useGoogleAnalytics;
