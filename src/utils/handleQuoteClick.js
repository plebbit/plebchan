function handleQuoteClick(reply, parentCid, threadCid) {
  const cid = parentCid ? parentCid : reply.shortCid;
  const isMobile = window.innerWidth <= 480;
  const postNumberSelector = isMobile ? '.post-number-mobile' : '.post-number-desktop';

  if (threadCid && cid === threadCid) {
    const highlightedElements = document.querySelectorAll('.highlighted');

    highlightedElements.forEach((el) => {
      el.classList.remove('highlighted');
    });

    const opElementSelector = isMobile ? '.op-mobile' : '.op-desktop';

    const opElement = [...document.querySelectorAll(opElementSelector)].find((el) => {
      const postNumberElement = el.querySelector(postNumberSelector);
      return postNumberElement && postNumberElement.innerHTML.includes(threadCid);
    });

    if (opElement) {
      opElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    } else {
      return;
    }

    return;
  }

  const targetElementSelector = isMobile ? '.post-reply-mobile, .op-mobile' : '.post-reply-desktop, .op-desktop';

  const targetElement = [...document.querySelectorAll(targetElementSelector)].find((el) => {
    const postNumberElement = el.querySelector(postNumberSelector);
    return postNumberElement && postNumberElement.innerHTML.includes(cid);
  });

  if (targetElement) {
    const highlightedElements = document.querySelectorAll('.highlighted-click');

    highlightedElements.forEach((el) => {
      el.classList.remove('highlighted-click');
    });

    targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });

    if (!targetElement.classList.contains('op-mobile') && !targetElement.classList.contains('op-desktop')) {
      targetElement.classList.add('highlighted-click');
    }
  } else {
    return;
  }
}

export default handleQuoteClick;
