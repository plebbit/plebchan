import { useMemo } from 'react';
import { Comment } from '@plebbit/plebbit-react-hooks';
import { flattenCommentsPages } from '@plebbit/plebbit-react-hooks/dist/lib/utils';

const useReplyCount = (comment: Comment) => {
  const replies = comment?.replies;
  const flattenedReplies = useMemo(() => flattenCommentsPages(replies), [replies]);

  return flattenedReplies.length;
};

export default useReplyCount;
