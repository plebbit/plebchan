function renderThreadComments(comments) {
  const commentKeys = Object.keys(comments);
  const renderedComments = commentKeys.map(key => {
    const comment = comments[key];
    const { replies: { pages: { topAll: { comments: nestedComments } } } } = comment;
    if (comment.replyCount > 0 && nestedComments) {
      const renderedNestedComments = renderThreadComments(nestedComments);
      return [comment, ...renderedNestedComments];
    }
    return [comment];
  }).flat();

  const sortedComments = renderedComments.sort((a, b) => a.timestamp - b.timestamp);
  return sortedComments;
}

export default renderThreadComments;