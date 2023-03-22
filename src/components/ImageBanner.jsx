import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ImageBanner = () => {
  const [currentImage, setCurrentImage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const countImages = async () => {
      const images = await importAll(require.context('../../public/assets/banners', false, /\.(png|jpe?g|svg)$/));
      setCurrentImage(Math.floor(Math.random() * images.length) + 1);
    };

    setIsLoaded(false);
    countImages();
  }, [location.key]);

  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.src = `${process.env.PUBLIC_URL}/assets/banners/banner-${currentImage}.jpg`;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [currentImage]);

  return (
    <>
      {isLoaded && <img id="banner-img" src={`${process.env.PUBLIC_URL}/assets/banners/banner-${currentImage}.jpg`} alt="banner" />}
    </>
  );
};

export function importAll(r) {
  return r.keys().map(r);
}

export default ImageBanner;