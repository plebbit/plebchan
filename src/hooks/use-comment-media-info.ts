import { useCallback, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getCommentMediaInfo, fetchWebpageThumbnailIfNeeded } from '../lib/utils/media-utils';
import { isPendingPostView, isPostPageView } from '../lib/utils/view-utils';

export const useCommentMediaInfo = (link: string, thumbnailUrl: string, linkWidth: number, linkHeight: number) => {
  const location = useLocation();
  const params = useParams();
  const isInPostPageView = isPostPageView(location.pathname, params);
  const isInPendingPostView = isPendingPostView(location.pathname, params);

  // some sites have CORS access, so the thumbnail can be fetched client-side, which is helpful if subplebbit.settings.fetchThumbnailUrls is false
  const fetchThumbnail = useCallback(async () => {
    let commentMediaInfo = getCommentMediaInfo(link, thumbnailUrl, linkWidth, linkHeight);
    if (commentMediaInfo?.type === 'webpage' && !commentMediaInfo.thumbnail) {
      const newMediaInfo = await fetchWebpageThumbnailIfNeeded(commentMediaInfo);
      // Fetch the dimensions of the thumbnail
      if (newMediaInfo.thumbnail) {
        const img = new Image();
        img.onload = () => {
          commentMediaInfo = {
            ...newMediaInfo,
            thumbnailWidth: img.width,
            thumbnailHeight: img.height,
          };
        };
        img.src = newMediaInfo.thumbnail;
      }
      commentMediaInfo = newMediaInfo;
    }
    return commentMediaInfo;
  }, [link, thumbnailUrl, linkWidth, linkHeight]);

  useEffect(() => {
    // don't fetch in feed view, it displaces the posts
    if (isInPostPageView && isInPendingPostView) {
      fetchThumbnail();
    }
  }, [fetchThumbnail, isInPostPageView, isInPendingPostView]);

  return getCommentMediaInfo(link, thumbnailUrl, linkWidth, linkHeight);
};
