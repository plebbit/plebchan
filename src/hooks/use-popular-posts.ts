import { useEffect, useState } from 'react';
import { Subplebbit } from '@plebbit/plebbit-react-hooks';
import { getCommentMediaInfo, getHasThumbnail } from '../lib/utils/media-utils';

const usePopularPosts = (subplebbits: Subplebbit[]) => {
  const [popularPosts, setPopularPosts] = useState<Comment[]>([]);

  useEffect(() => {
    const uniqueLinks: Set<string> = new Set();
    const allPosts: Comment[] = [];

    let postsPerSub = 1;
    if (subplebbits.length === 2) {
      postsPerSub = 4;
    } else if (subplebbits.length === 3) {
      postsPerSub = 3;
    } else if (subplebbits.length >= 4 && subplebbits.length < 8) {
      postsPerSub = 2;
    }

    subplebbits.forEach((subplebbit: any) => {
      let subplebbitPosts: Comment[] = [];

      if (subplebbit?.posts?.pages?.hot?.comments) {
        for (const post of Object.values(subplebbit.posts.pages.hot.comments as Comment)) {
          const { deleted, link, locked, pinned, removed, replyCount, timestamp } = post;
          const commentMediaInfo = getCommentMediaInfo(post);
          const isMediaShowed = getHasThumbnail(commentMediaInfo, link);

          if (
            isMediaShowed &&
            (replyCount > 0 || postsPerSub > 1) &&
            !deleted &&
            !removed &&
            !locked &&
            !pinned &&
            timestamp > Date.now() / 1000 - 60 * 60 * 24 * 30 &&
            !uniqueLinks.has(link)
          ) {
            subplebbitPosts.push(post);
            uniqueLinks.add(link);
          }
        }

        subplebbitPosts.sort((a: any, b: any) => b.timestamp - a.timestamp);
        allPosts.push(...subplebbitPosts.slice(0, postsPerSub));
      }
    });

    const sortedPosts = allPosts.sort((a: any, b: any) => b.timestamp - a.timestamp).slice(0, 8);

    setPopularPosts(sortedPosts);
  }, [subplebbits]);

  return popularPosts;
};

export default usePopularPosts;
