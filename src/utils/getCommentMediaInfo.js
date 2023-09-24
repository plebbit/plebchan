import extName from 'ext-name';
import { canEmbed } from '../components/Embed';

const getCommentMediaInfo = (comment) => {
  if (!comment?.thumbnailUrl && !comment?.link) {
    return;
  }

  if (comment?.link) {
    try {
      const url = new URL(comment.link);
      const host = url.hostname;
      let scrapedThumbnailUrl;

      if (['youtube.com', 'www.youtube.com', 'youtu.be'].includes(host)) {
        const videoId = host === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v');
        scrapedThumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
      } else if (host.includes('bitchute.com')) {
        const videoId = url.pathname.split('/')[2];
        scrapedThumbnailUrl = `https://static-3.bitchute.com/live/cover_images/F61vWF4shy8s/${videoId}_640x360.jpg`;
      } else if (host.includes('streamable.com')) {
        const videoId = url.pathname.split('/')[1];
        scrapedThumbnailUrl = `https://cdn-cf-east.streamable.com/image/${videoId}.jpg`;
      }

      if (canEmbed(url)) {
        return {
          url: comment.link,
          type: 'iframe',
          thumbnail: comment.thumbnailUrl || scrapedThumbnailUrl,
        };
      }

      const mime = extName(url.pathname.toLowerCase().replace('/', ''))[0]?.mime;

      if (mime?.startsWith('image')) {
        return {
          url: comment.link,
          type: 'image',
        };
      }

      if (mime?.startsWith('video')) {
        return {
          url: comment.link,
          type: 'video',
          thumbnail: comment.thumbnailUrl,
        };
      }

      if (mime?.startsWith('audio')) {
        return {
          url: comment.link,
          type: 'audio',
        };
      }
    } catch (error) {
      return;
    }
  }

  if (comment?.thumbnailUrl && comment?.thumbnailUrl !== comment?.link) {
    return {
      url: comment.link,
      type: 'webpage',
      thumbnail: comment.thumbnailUrl,
    };
  }

  if (comment?.link) {
    return {
      url: comment.link,
      type: 'webpage',
    };
  }
};

export default getCommentMediaInfo;
