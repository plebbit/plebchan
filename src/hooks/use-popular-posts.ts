import { useEffect, useState } from 'react';
import { Subplebbit } from '@plebbit/plebbit-react-hooks';
import { getCommentMediaInfo, getHasThumbnail } from '../lib/utils/media-utils';

const usePopularPosts = (subplebbits: Subplebbit[]) => {
  const [popularPosts, setPopularPosts] = useState<Comment[]>([]);

  useEffect(() => {
    const subplebbitToPost: { [key: string]: any } = {};
    const uniqueLinks: Set<string> = new Set();

    subplebbits.forEach((subplebbit: any) => {
      let maxTimestamp = -Infinity;
      let mostRecentPost = null;

      if (subplebbit?.posts?.pages?.hot?.comments) {
        for (const post of Object.values(subplebbit.posts.pages.hot.comments as Comment)) {
          const { deleted, link, locked, pinned, removed, replyCount, timestamp } = post;
          const commentMediaInfo = getCommentMediaInfo(post);
          const isMediaShowed = getHasThumbnail(commentMediaInfo, link);

          if (
            isMediaShowed &&
            replyCount > 0 &&
            !deleted &&
            !removed &&
            !locked &&
            !pinned &&
            timestamp > Date.now() / 1000 - 60 * 60 * 24 * 30 &&
            timestamp > maxTimestamp &&
            !uniqueLinks.has(link)
          ) {
            maxTimestamp = post.timestamp;
            mostRecentPost = post;
            uniqueLinks.add(link);
          }
        }

        if (mostRecentPost) {
          subplebbitToPost[subplebbit.address] = { post: mostRecentPost, timestamp: maxTimestamp };
        }
      }
    });

    const sortedPosts = Object.values(subplebbitToPost)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);

    setPopularPosts(sortedPosts.map((item) => item.post));
  }, [subplebbits]);

  return popularPosts;
};

export default usePopularPosts;
