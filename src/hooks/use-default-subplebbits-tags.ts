import { useMemo } from 'react';

// Add this helper function to collect unique tags from subplebbits
const getUniqueTags = (multisub: any) => {
  const allTags = new Set<string>();
  Object.values(multisub).forEach((sub: any) => {
    if (sub?.tags?.length) {
      sub.tags.forEach((tag: string) => allTags.add(tag));
    }
  });
  return Array.from(allTags).sort();
};

// Export tags as a derived value where it's needed
export const useDefaultSubplebbitTags = (subplebbits: any) => {
  return useMemo(() => getUniqueTags(subplebbits), [subplebbits]);
};
