function countLinks(comment) {
  let linkCount = 0;

  if (comment.replyCount > 0) {
    for (let reply of comment.replies.pages.topAll.comments) {
      if (reply.link) {
        linkCount++;
      }

      if (reply.replyCount > 0) {
        linkCount += countLinks(reply);
      }
    }
  }

  return linkCount;
}

export default countLinks;
