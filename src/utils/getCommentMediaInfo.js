import extName from 'ext-name';

const getCommentMediaInfo = (comment) => {
  if (!comment?.thumbnailUrl && !comment?.link) {
    return;
  }

  if (comment?.link) {
    try {
      const url = new URL(comment.link);
      const host = url.hostname;
      let embedUrl = null;

      if (['youtube.com', 'www.youtube.com', 'youtu.be'].includes(host)) {
        const videoId = host === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v');
        embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
        return {
          url: comment.link,
          embedUrl,
          type: 'iframe',
          thumbnail: comment.thumbnailUrl || thumbnailUrl,
        };
      } else if (host.includes('odysee.com')) {
        const pathComponents = url.pathname.split('/');
        const channelAndId = pathComponents[1];
        const videoAndId = pathComponents[2];
        embedUrl = `https://odysee.com/$/embed/${channelAndId}/${videoAndId}`;

        // TODO: add support for Rumble, video id is dynamic

      // } else if (host.includes('rumble.com')) {
      //   const regex = /(\/v.+?)-/;
      //   const match = regex.exec(url.pathname);
      //   if (match) {
      //     const videoId = match[1].slice(1);
      //     embedUrl = `https://rumble.com/embed/${videoId}/?pub=4`;
      //   }


      } else if (host.includes('bitchute.com')) {
        const videoId = url.pathname.split('/')[2];
        embedUrl = `https://www.bitchute.com/embed/${videoId}/`;
      } else if (host.includes('streamable.com')) {
        const videoId = url.pathname.split('/')[1];
        embedUrl = `https://streamable.com/e/${videoId}?quality=highest`;
        
        // TODO: Add support for Giphy (doesn't have thumbnails, size is variable)

      // } else if (host.includes('giphy.com')) {
      //   const hyphenComponents = url.pathname.split('-');
      //   const gifId = hyphenComponents[hyphenComponents.length - 1];
      //   embedUrl = `https://giphy.com/embed/${gifId}`;
      }

      if (embedUrl) {
        return {
          url: comment.link,
          embedUrl,
          type: 'iframe',
          thumbnail: comment.thumbnailUrl,
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