import React, { useState, useEffect } from 'react';

const ImageBanner = () => {
  const [currentImage, setCurrentImage] = useState(1);

  useEffect(() => {
    setCurrentImage(Math.floor(Math.random() * 13) + 1);
  }, []);

  return (
    <img id="banner-img" src={`/assets/banners/banner-${currentImage}.jpg`} alt="banner" />
  );
};

export default ImageBanner;