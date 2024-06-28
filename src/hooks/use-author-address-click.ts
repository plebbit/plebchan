const useAuthorAddressClick = () => {
  const handleUserAddressClick = (shortAddress: string | undefined) => {
    if (!shortAddress) return;

    // Select the elements corresponding to the clicked short address
    const elements = document.querySelectorAll(`.${shortAddress}`);

    // Check if the clicked address is already highlighted
    const isAlreadyHighlighted = Array.from(elements).some((element) => element.classList.contains('highlight'));

    // Remove highlight from all elements with the .highlight class
    const prevElements = document.querySelectorAll('.highlight');
    prevElements.forEach((element) => {
      element.classList.remove('highlight');
    });

    // If the clicked address was already highlighted, don't add the highlight back
    if (isAlreadyHighlighted) return;

    // Highlight the new elements
    elements.forEach((element) => {
      element.classList.add('highlight');
    });
  };

  return handleUserAddressClick;
};

export default useAuthorAddressClick;
