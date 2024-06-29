import { useParams } from 'react-router-dom';

const useAuthorAddressClick = () => {
  const { commentCid } = useParams<{ commentCid: string }>();

  const handleUserAddressClick = (shortAddress: string) => {
    // Select the elements corresponding to the clicked short address
    const elements = document.querySelectorAll(`[data-author-address="${shortAddress}"]`);

    // Check if the clicked address is already highlighted
    const isAlreadyHighlighted = Array.from(elements).some((element) => element.classList.contains('highlight'));

    // Remove highlight from all elements with the .highlight class
    const prevElements = document.querySelectorAll('.highlight');
    prevElements.forEach((element) => {
      element.classList.remove('highlight');
    });

    // If the clicked address was already highlighted, don't add the highlight back
    if (isAlreadyHighlighted) return;

    // Highlight the new elements, excluding the element matching the cid if it is the OP post
    elements.forEach((element) => {
      if (element.getAttribute('data-cid') !== commentCid) {
        element.classList.add('highlight');
      }
    });
  };

  return handleUserAddressClick;
};

export default useAuthorAddressClick;
