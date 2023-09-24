const handleImageClick = (e) => {
  const image = e.target;
  const container = image.closest('.img-container');

  image.classList.toggle('enlarged');

  if (container) {
    container.classList.toggle('expanded-container');
  }
};

export default handleImageClick;
