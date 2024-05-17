import { useEffect, useMemo, useState } from 'react';

export interface MultisubMetadata {
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface MultisubSubplebbit {
  title?: string;
  address: string;
  tags?: string[];
  features?: string[];
}

let cacheSubplebbits: MultisubSubplebbit[] | null = null;
let cacheMetadata: MultisubMetadata | null = null;

const useDefaultSubplebbits = () => {
  const [subplebbits, setSubplebbits] = useState<MultisubSubplebbit[]>([]);

  useEffect(() => {
    if (cacheSubplebbits) {
      return;
    }
    (async () => {
      try {
        const multisub = await fetch(
          'https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/multisub.json',
          // { cache: 'no-cache' }
        ).then((res) => res.json());
        cacheSubplebbits = multisub.subplebbits;
        setSubplebbits(multisub.subplebbits);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  return cacheSubplebbits || subplebbits;
};

export const categorizeSubplebbits = (subplebbits: MultisubSubplebbit[]) => {
  const plebbitSubs = subplebbits.filter((sub) => sub.tags?.includes('plebbit'));
  const interestsSubs = subplebbits.filter(
    (sub) => sub.tags?.includes('topic') && !sub.tags?.includes('plebbit') && !sub.tags?.includes('country') && !sub.tags?.includes('international'),
  );
  const randomSubs = subplebbits.filter((sub) => sub.tags?.includes('random') && !sub.tags?.includes('plebbit'));
  const internationalSubs = subplebbits.filter((sub) => sub.tags?.includes('international') || sub.tags?.includes('country'));
  const projectsSubs = subplebbits.filter((sub) => sub.tags?.includes('project') && !sub.tags?.includes('plebbit') && !sub.tags?.includes('topic'));

  return { plebbitSubs, interestsSubs, randomSubs, internationalSubs, projectsSubs };
};

export const useDefaultSubplebbitAddresses = () => {
  const defaultSubplebbits = useDefaultSubplebbits();
  const categorizedSubplebbits = useMemo(() => categorizeSubplebbits(defaultSubplebbits), [defaultSubplebbits]);
  return useMemo(
    () =>
      [
        ...categorizedSubplebbits.plebbitSubs,
        ...categorizedSubplebbits.projectsSubs,
        ...categorizedSubplebbits.interestsSubs,
        ...categorizedSubplebbits.randomSubs,
        ...categorizedSubplebbits.internationalSubs,
      ].map((subplebbit) => subplebbit.address),
    [categorizedSubplebbits],
  );
};

export const useMultisubMetadata = () => {
  const [metadata, setMetadata] = useState<MultisubMetadata | null>(null);

  useEffect(() => {
    if (cacheMetadata) {
      return;
    }
    (async () => {
      try {
        const multisub = await fetch(
          'https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/multisub.json',
          // { cache: 'no-cache' }
        ).then((res) => res.json());
        const { title, description, createdAt, updatedAt } = multisub;
        const metadata: MultisubMetadata = { title, description, createdAt, updatedAt };
        cacheMetadata = metadata;
        setMetadata(metadata);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  return cacheMetadata || metadata;
};

export default useDefaultSubplebbits;
