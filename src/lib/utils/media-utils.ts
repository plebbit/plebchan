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
}

export const getDisplayMediaInfoType = (type: string, t: any) => {
  switch (type) {
    case 'image':
      return t('image');
    case 'animated gif':
      return t('animated_gif');
    case 'static gif':
      return t('static_gif');
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

    try {
      const fileName = url.pathname.slice(url.pathname.lastIndexOf('/') + 1).toLowerCase();
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

export const getCommentMediaInfo = (comment: Comment): CommentMediaInfo | undefined => {
  if (!comment?.thumbnailUrl && !comment?.link) {
    return;
  }
  const linkInfo = comment.link ? getLinkMediaInfo(comment.link) : undefined;
  if (linkInfo) {
    linkInfo.thumbnail = comment.thumbnailUrl || linkInfo.thumbnail;
    return linkInfo;
  }
  return;
};
