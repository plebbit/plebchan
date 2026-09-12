export const getCommentCommunityAddress = (comment?: unknown) => {
  if (!comment || typeof comment !== 'object') {
    return undefined;
  }

  const record = comment as { communityAddress?: unknown };
  if (typeof record.communityAddress === 'string' && record.communityAddress) {
    return record.communityAddress;
  }

  return undefined;
};

export const hasAuthoritativeCommentPayload = (comment?: unknown): boolean => {
  if (!comment || typeof comment !== 'object') {
    return false;
  }

  const record = comment as {
    timestamp?: unknown;
    content?: unknown;
    title?: unknown;
    link?: unknown;
    thumbnailUrl?: unknown;
    deleted?: unknown;
    removed?: unknown;
  };

  return Boolean(record.timestamp !== undefined || record.content || record.title || record.link || record.thumbnailUrl || record.deleted || record.removed);
};

// Protocol comments already carry canonical communityAddress fields, including replies.
// Keep this compatibility entry point without walking every nested reply on each render.
export const withResolvedCommentCommunityAddress = <T>(comment: T): T => comment;
