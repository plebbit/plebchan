function renderThreadComments(comment, pendingComment = null) {
  const nestedComments = comment?.replies?.pages?.topAll?.comments || {};
  const commentKeys = Object.keys(nestedComments);

  const renderedComments = commentKeys.map(key => {
    const comment = nestedComments[key];
    const { replies: { pages: { topAll: { comments: childNestedComments = [] } = {} } = {} } = {} } = comment;
    if (comment.replyCount > 0 && childNestedComments) {
      const renderedNestedComments = renderThreadComments(comment);
      return [comment, ...renderedNestedComments];
    }
    return [comment];
  }).flat();

  const sortedComments = renderedComments.sort((a, b) => a.timestamp - b.timestamp);

  if (pendingComment?.parentCid === comment?.cid) {
    sortedComments.push(pendingComment);
  }

  return sortedComments;
}

export default renderThreadComments;