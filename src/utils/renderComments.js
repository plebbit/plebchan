function renderComments(comments) {
  let displayedCount = 0;
  let omittedCount = 0;

  const renderComment = (comment) => {
    const { replyCount, replies: { pages: { topAll: { comments: nestedComments } } } } = comment;
    let renderedNestedComments = [];

    if (replyCount > 0 && nestedComments.length > 0) {
      const result = renderComments(nestedComments);
      renderedNestedComments = result.renderedComments;
      omittedCount += result.omittedCount;
    }

    const allComments = [comment, ...renderedNestedComments];
    const displayedComments = allComments.slice(0, 5 - displayedCount);

    displayedCount += displayedComments.length;
    omittedCount += allComments.length - displayedComments.length;

    return displayedComments;
  };

  const renderedComments = comments.flatMap(renderComment);
  renderedComments.sort((a, b) => a.timestamp - b.timestamp);

  return { renderedComments, omittedCount };
}

export default renderComments;