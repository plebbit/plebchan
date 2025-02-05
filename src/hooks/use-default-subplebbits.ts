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

export const useDefaultSubplebbitAddresses = () => {
  const defaultSubplebbits = useDefaultSubplebbits();
  return useMemo(() => defaultSubplebbits.map((subplebbit) => subplebbit.address), [defaultSubplebbits]);
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
