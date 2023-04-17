function findParentShortCid(parentCid, input) {
  const feed = Array.isArray(input) ? input : [input];

  for (const thread of feed) {
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