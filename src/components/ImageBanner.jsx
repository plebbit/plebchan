import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ImageBanner = () => {
  const [currentImage, setCurrentImage] = useState(1);
  const location = useLocation();

  useEffect(() => {
    setCurrentImage(Math.floor(Math.random() * 13) + 1);
  }, [location.key]);

  return (
    <img id="banner-img" src={`/assets/banners/banner-${currentImage}.jpg`} alt="banner" />
  );
};

export default ImageBanner;
