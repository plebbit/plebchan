import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ImageBanner = () => {
  const [currentImage, setCurrentImage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoaded(false);
    setCurrentImage(Math.floor(Math.random() * 13) + 1);
  }, [location.key]);

  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.src = `/assets/banners/banner-${currentImage}.jpg`;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [currentImage]);

  return (
    <>
      {isLoaded && <img id="banner-img" src={`/assets/banners/banner-${currentImage}.jpg`} alt="banner" />}
    </>
  );
};

export default ImageBanner;
