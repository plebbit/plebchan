function handleShareClick(selectedAddress, cid) {
  let shareLink;

  if (cid === 'rules' || cid === 'description') {
    shareLink = `https://plebchan.eth.limo/#/p/${selectedAddress}`;
  } else {
    const plebBzBaseURL = 'https://pleb.bz/p/';
    shareLink = `${plebBzBaseURL}${selectedAddress}/`;

    if (cid !== 'rules' && cid !== 'description') {
      shareLink += `c/${cid}`;
    }

    shareLink += `?redirect=plebchan.eth.limo`;
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareLink).catch((err) => {
      console.error('Could not copy text: ', err);
    });
  } else {
    return;
  }
}

export default handleShareClick;
