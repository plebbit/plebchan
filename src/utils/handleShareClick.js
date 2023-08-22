function handleShareClick(selectedAddress, cid) {
  const plebBzBaseURL = "https://pleb.bz/p/";

  let shareLink = `${plebBzBaseURL}${selectedAddress}/`;

  if (cid === "rules" || cid === "description") {
    shareLink += cid;
  } else {
    shareLink += `c/${cid}`;
  }

  shareLink += `?redirect=plebchan.eth.limo`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareLink).then(() => {
      console.log("Link copied to clipboard!");
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  } else {
    return;
  }
}

export default handleShareClick;