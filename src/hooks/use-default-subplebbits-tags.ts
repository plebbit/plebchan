import { useMemo } from 'react';

const getUniqueTags = (multisub: any) => {
  const allTags = new Set<string>();
  Object.values(multisub).forEach((sub: any) => {
    if (sub?.tags?.length) {
      sub.tags.forEach((tag: string) => allTags.add(tag));
    }
  });
  return Array.from(allTags).sort();
};

export const useDefaultSubplebbitTags = (subplebbits: any) => {
  return useMemo(() => getUniqueTags(subplebbits), [subplebbits]);
};
