import { useEffect, useMemo, useState } from 'react';

export interface MultisubSubplebbit {
  title?: string;
  address: string;
  tags?: string[];
  features?: string[];
}

let cache: MultisubSubplebbit[] | null = null;

const useDefaultSubplebbits = () => {
  const [subplebbits, setSubplebbits] = useState<MultisubSubplebbit[]>([]);

  useEffect(() => {
    if (cache) {
      return;
    }
    (async () => {
      try {
        const multisub = await fetch(
          'https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/multisub.json',
          // { cache: 'no-cache' }
        ).then((res) => res.json());
        cache = multisub.subplebbits;
        setSubplebbits(multisub.subplebbits);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  return cache || subplebbits;
};

export const useDefaultSubplebbitAddresses = () => {
  const defaultSubplebbits = useDefaultSubplebbits();
  return useMemo(() => defaultSubplebbits.map((subplebbit: MultisubSubplebbit) => subplebbit.address), [defaultSubplebbits]);
};

export default useDefaultSubplebbits;
