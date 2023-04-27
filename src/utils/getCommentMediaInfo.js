import extName from 'ext-name';

const getCommentMediaInfo = (comment) => {
  if (!comment?.thumbnailUrl && !comment?.link) {
    return;
  }

  if (comment?.link) {
    try {
      new URL(comment.link);
    } catch (error) {
      // console.error("Invalid URL:", comment.link);
      return;
    }

    const mime = extName(new URL(comment?.link).pathname.replace('/', ''))[0]?.mime;

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
      };
    }

    if (mime?.startsWith('audio')) {
      return {
        url: comment.link,
        type: 'audio',
      };
    }
  }

  if (comment?.thumbnailUrl && comment?.thumbnailUrl !== comment?.link) {
    return {
      url: comment.thumbnailUrl,
      type: 'webpage',
    };
  }
};

export default getCommentMediaInfo;