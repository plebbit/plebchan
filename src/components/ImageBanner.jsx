import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ImageBanner = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const location = useLocation();

  const parentRoute = location.pathname.split('/').slice(0, 3).join('/');

  useEffect(() => {
    let isMounted = true;

    const loadRandomImage = async () => {
      const images = await importAll(require.context('../../public/assets/banners', false, /\.(png|jpe?g|svg)$/));
      const randomImage = Math.floor(Math.random() * images.length) + 1;

      const img = new Image();
      img.src = `${process.env.PUBLIC_URL}/assets/banners/banner-${randomImage}.jpg`;

      img.onload = () => {
        if (isMounted) {
          setCurrentImage(randomImage);
        }
      };
    };

    loadRandomImage();

    return () => {
      isMounted = false;
    };
  }, [parentRoute]);

  return <>{currentImage && <img id='banner-img' src={`${process.env.PUBLIC_URL}/assets/banners/banner-${currentImage}.jpg`} alt='banner' />}</>;
};

export function importAll(r) {
  return r.keys().map(r);
}

export default ImageBanner;
