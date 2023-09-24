function removeHighlight() {
  const highlightedElements = document.querySelectorAll('.highlighted');

  highlightedElements.forEach((el) => {
    el.classList.remove('highlighted');
  });
}

export default removeHighlight;
