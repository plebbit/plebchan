function handleQuoteClick(reply, parentCid, threadCid) {
  const cid = parentCid ? parentCid : reply.shortCid;
  const isMobile = window.innerWidth <= 480;

  if (threadCid && cid === threadCid) {
    const highlightedElements = document.querySelectorAll('.highlighted');

    highlightedElements.forEach(el => {
      el.classList.remove('highlighted');
    });

    return;
  }

  const targetElementSelector = isMobile ? '.post-reply-mobile' : '.post-reply-desktop';
  const postNumberSelector = isMobile ? '.post-number-mobile' : '.post-number-desktop';

  const targetElement = [...document.querySelectorAll(targetElementSelector)]
    .find(el => {
      const postNumberElement = el.querySelector(postNumberSelector);
      return postNumberElement && postNumberElement.innerHTML.includes(cid);
    });

  if (targetElement) {
    const highlightedElements = document.querySelectorAll('.highlighted');

    highlightedElements.forEach(el => {
      el.classList.remove('highlighted');
    });

    targetElement.scrollIntoView({ behavior: "auto", block: "center" });
    targetElement.classList.add('highlighted');

  } else {
    console.log('Could not find target element');
  }
};

export default handleQuoteClick;