function handleQuoteHover(reply, parentCid, onElementOutOfView) {
  const cid = parentCid ? parentCid : reply.shortCid;
  const isMobile = window.innerWidth <= 480;
  const postNumberSelector = isMobile ? '.post-number-mobile' : '.post-number-desktop';

  const targetElementSelector = isMobile ? '.post-reply-mobile, .op-mobile' : '.post-reply-desktop, .op-desktop';

  const targetElement = [...document.querySelectorAll(targetElementSelector)].find((el) => {
    const postNumberElement = el.querySelector(postNumberSelector);
    return postNumberElement && postNumberElement.innerHTML.includes(cid);
  });

  if (targetElement) {
    const isInViewport = (element) => {
      const bounding = element.getBoundingClientRect();
      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    if (isInViewport(targetElement)) {
      const highlightedElements = document.querySelectorAll('.highlighted');

      highlightedElements.forEach((el) => {
        el.classList.remove('highlighted');
      });

      if (!targetElement.classList.contains('op-mobile') && !targetElement.classList.contains('op-desktop')) {
        targetElement.classList.add('highlighted');
      }
    } else {
      onElementOutOfView();
    }
  } else {
    onElementOutOfView();
  }
}

export default handleQuoteHover;
