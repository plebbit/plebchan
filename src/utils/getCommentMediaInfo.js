import extName from 'ext-name';

const getCommentMediaInfo = (comment) => {
  if (!comment?.thumbnailUrl && !comment?.link) {
    return;
  }
  if (comment?.thumbnailUrl) {
    return {
      url: comment.link,
      type: 'webpage'
    };
  }
  if (comment?.link) {
    const mime = extName(new URL(comment?.link).pathname.replace('/', ''))[0]?.mime
    if (mime?.startsWith('image')) {
      return {
        url: comment.link,
        type: 'image'
      };
    }
  
    if (mime?.startsWith('video')) {
      return {
        url: comment.link,
        type: 'video'
      };
    }

    if (mime?.startsWith('audio')) {
      return {
        url: comment.link,
        type: 'audio'
      };
    }
  }
};

export default getCommentMediaInfo;