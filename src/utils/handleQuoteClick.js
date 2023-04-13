function handleQuoteClick(reply) {
  const cid = reply.shortCid;
  const targetElement = [...document.querySelectorAll('.post-reply')]
    .find(el => el.innerHTML.includes(cid));
  if (targetElement) {
      targetElement.scrollIntoView({ behavior: "instant" });
  } else {
    console.log('Could not find target element');
  }
};

export default handleQuoteClick;