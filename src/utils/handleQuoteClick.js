function handleQuoteClick(reply, parentCid) {
  const cid = parentCid ? parentCid : reply.shortCid;
  const targetElement = [...document.querySelectorAll('.post-reply')]
    .find(el => {
      const postNumberElement = el.querySelector('.post-number');
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