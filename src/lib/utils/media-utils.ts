import { Comment } from '@plebbit/plebbit-react-hooks';
import extName from 'ext-name';
import { canEmbed } from '../../components/embed';
import memoize from 'memoizee';
import { isValidURL } from './url-utils';

export interface CommentMediaInfo {
  url: string;
  type: string;
  thumbnail?: string;
  patternThumbnailUrl?: string;
  post?: Comment;
}

export const getDisplayMediaInfoType = (type: string, t: any) => {
  switch (type) {
    case 'image':
      return t('image');
    case 'animated gif':
      return t('animated_gif');
    case 'static gif':
      return t('gif');
    case 'iframe':
      return t('iframe');
    case 'video':
      return t('video');
    case 'audio':
      return t('audio');
    default:
      return t('webpage');
  }
};

export const getHasThumbnail = (commentMediaInfo: CommentMediaInfo | undefined, link: string | undefined): boolean => {
  const iframeThumbnail = commentMediaInfo?.patternThumbnailUrl || commentMediaInfo?.thumbnail;
  return link &&
    commentMediaInfo &&
    (commentMediaInfo.type === 'image' ||
      commentMediaInfo.type === 'video' ||
      commentMediaInfo.type === 'audio' ||
      commentMediaInfo.type === 'gif' ||
      (commentMediaInfo.type === 'webpage' && commentMediaInfo.thumbnail) ||
      (commentMediaInfo.type === 'iframe' && iframeThumbnail))
    ? true
    : false;
};

const getYouTubeVideoId = (url: URL): string | null => {
  if (url.host.includes('youtu.be')) {
    return url.pathname.slice(1);
  } else if (url.searchParams.has('v')) {
    return url.searchParams.get('v');
  }
  return null;
};

const getPatternThumbnailUrl = (url: URL): string | undefined => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }
  if (url.host.includes('streamable.com')) {
    const videoId = url.pathname.split('/')[1];
    return `https://cdn-cf-east.streamable.com/image/${videoId}.jpg`;
  }
};

export const getLinkMediaInfo = memoize(
  (link: string): CommentMediaInfo | undefined => {
    if (!isValidURL(link)) {
      return;
    }
    const url = new URL(link);
    let patternThumbnailUrl: string | undefined;
    let type: string = 'webpage';
    let mime: string | undefined;

    if (url.pathname === '/_next/image' && url.search.startsWith('?url=')) {
      return { url: link, type: 'image' };
    }

    try {
      const fileName = url.pathname.split('/').pop() || '';
      if (fileName.includes('.')) {
        mime = extName(fileName)[0]?.mime;
        if (mime) {
          if (mime.startsWith('image')) {
            type = mime === 'image/gif' ? 'gif' : 'image';
          } else if (mime.startsWith('video')) {
            type = 'video';
          } else if (mime.startsWith('audio')) {
            type = 'audio';
          }
        }
      }

      if (canEmbed(url) || url.host.startsWith('yt.')) {
        type = 'iframe';
        patternThumbnailUrl = getPatternThumbnailUrl(url);
      }
    } catch (e) {
      console.error(e);
    }

    return { url: link, type, patternThumbnailUrl };
  },
  { max: 1000 },
);

// some sites have CORS access, so the thumbnail can be fetched client-side, which is helpful if subplebbit.settings.fetchThumbnailUrls is false
const fetchWebpageThumbnail = async (url: string): Promise<string | undefined> => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Try to find Open Graph image
    const ogImage = doc.querySelector('meta[property="og:image"]');
    if (ogImage && ogImage.getAttribute('content')) {
      return ogImage.getAttribute('content')!;
    }

    // If no Open Graph image, try to find the first image
    const firstImage = doc.querySelector('img');
    if (firstImage && firstImage.getAttribute('src')) {
      return new URL(firstImage.getAttribute('src')!, url).href;
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching webpage thumbnail:', error);
    return undefined;
  }
};

export const fetchWebpageThumbnailIfNeeded = async (commentMediaInfo: CommentMediaInfo): Promise<CommentMediaInfo> => {
  if (commentMediaInfo.type === 'webpage' && !commentMediaInfo.thumbnail) {
    const thumbnail = await fetchWebpageThumbnail(commentMediaInfo.url);
    return { ...commentMediaInfo, thumbnail };
  }
  return commentMediaInfo;
};

export const getCommentMediaInfo = (comment: Comment): CommentMediaInfo | undefined => {
  if (!comment?.thumbnailUrl && !comment?.link) {
    return;
  }
  const linkInfo = comment.link ? getLinkMediaInfo(comment.link) : undefined;
  if (linkInfo) {
    return {
      ...linkInfo,
      thumbnail: comment.thumbnailUrl || linkInfo.thumbnail,
      post: comment,
    };
  }
  return;
};

export const getMediaDimensions = (commentMediaInfo: CommentMediaInfo | undefined): string => {
  if (!commentMediaInfo) return '';

  const { type, url, post } = commentMediaInfo;

  if (type === 'iframe' && url) {
    const embedUrl = new URL(url);
    if (canEmbed(embedUrl)) {
      // hardcoded dimensions from embed.module.css
      if (embedUrl.hostname.includes('youtube.com') || embedUrl.hostname.includes('youtu.be')) {
        return '800x450';
      } else if (embedUrl.hostname.includes('instagram.com')) {
        return '360x420';
      } else if (embedUrl.hostname.includes('reddit.com')) {
        return '500x520';
      } else if (embedUrl.hostname.includes('tiktok.com')) {
        return '400x780';
      } else if (embedUrl.hostname.includes('x.com') || embedUrl.hostname.includes('twitter.com')) {
        return '550x580';
      } else if (embedUrl.hostname.includes('soundcloud.com')) {
        return '700x166';
      }
    }
  } else if (type === 'audio') {
    return '700x240'; // hardcoded dimensions from embed.module.css
  } else if (type === 'image' || type === 'video' || type === 'gif') {
    // media dimensions calculated by API
    if (post?.linkWidth && post?.linkHeight) {
      return `${post.linkWidth}x${post.linkHeight}`;
    }
  }

  return '';
};
