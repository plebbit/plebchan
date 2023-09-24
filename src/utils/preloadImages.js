const preloadImages = (imageUrls) => {
  imageUrls.forEach((imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
  });
};

export default preloadImages;
