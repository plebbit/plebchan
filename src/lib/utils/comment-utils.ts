import { Comment } from '@plebbit/plebbit-react-hooks';

export const countLinksInCommentReplies = (comment: Comment) => {
  let linkCount = 0;

  if (comment.replyCount > 0) {
    for (let reply of comment.replies.pages.topAll.comments) {
      if (reply.link) {
        linkCount++;
      }

      if (reply.replyCount > 0) {
        linkCount += countLinksInCommentReplies(reply);
      }
    }
  }

  return linkCount;
};
