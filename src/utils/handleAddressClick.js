function handleAddressClick(shortAddress) {
  const isMobile = window.innerWidth <= 480;
  const addressSelector = isMobile ? '.address-mobile' : '.address-desktop';
  const postReplySelector = isMobile ? '.post-reply-mobile' : '.post-reply-desktop';
  const opSelector = isMobile ? '.op-mobile' : '.op-desktop';

  const matchingElements = [...document.querySelectorAll(postReplySelector + ',' + opSelector)].filter(el => {
    const addressElement = el.querySelector(addressSelector);
    return addressElement && addressElement.textContent.includes(shortAddress);
  });

  if (matchingElements.length === 0) {
    return;
  }

  const highlightedElements = document.querySelectorAll('.highlighted');
  highlightedElements.forEach(el => {
    el.classList.remove('highlighted');
  });

  matchingElements.forEach(el => {
    if (!el.classList.contains('op-mobile') && !el.classList.contains('op-desktop')) {
      el.classList.add('highlighted');
    }
  });
}

export default handleAddressClick;