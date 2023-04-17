function findParentShortCid(parentCid, selectedFeed) {
  for (const thread of selectedFeed) {
    if (thread.cid === parentCid) {
      return thread.shortCid;
    }
    if (thread.replyCount > 0 && thread.replies.pages.topAll.comments) {
      const shortCid = findParentShortCid(parentCid, thread.replies.pages.topAll.comments);
      if (shortCid) {
        return shortCid;
      }
    }
  }
  return null;
}

export default findParentShortCid;