import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Subplebbit, useAccount, useAccountSubplebbits } from '@plebbit/plebbit-react-hooks';
import Plebbit from '@plebbit/plebbit-js/dist/browser/index.js';
import useHomeFiltersStore from '../../../stores/use-home-filters-store';
import { useMultisubMetadata } from '../../../hooks/use-default-subplebbits';
import styles from '../home.module.css';
import { nsfwTags } from '../home';
import BoxModal from '../box-modal';
import useIsSubplebbitOffline from '../../../hooks/use-is-subplebbit-offline';

const Board = ({ subplebbit, subplebbits, useCatalog }: { subplebbit: Subplebbit; subplebbits: any; useCatalog?: boolean }) => {
  const { t } = useTranslation();
  const { address, title, tags } = subplebbit || {};
  const nsfwTag = tags.find((tag: string) => nsfwTags.includes(tag));

  const boardLink = useCatalog ? `/p/${address}/catalog` : `/p/${address}`;

  const subplebbitData = subplebbits && subplebbits.find((sub: Subplebbit) => sub?.address === address);
  const { isOffline, isOnlineStatusLoading, offlineIconClass, offlineTitle } = useIsSubplebbitOffline(subplebbitData);

  return (
    <div className={styles.subplebbit} key={address}>
      {(isOffline || isOnlineStatusLoading) && <span className={`${styles.offlineIcon} ${offlineIconClass}`} title={offlineTitle} />}
      <Link to={boardLink}>{title || address}</Link>
      {nsfwTag && <span className={styles.nsfw}> ({t(nsfwTag)})</span>}
    </div>
  );
};

const BoardsBox = ({ multisub, subplebbits }: { multisub: Subplebbit[]; subplebbits: any }) => {
  const { t } = useTranslation();
  const account = useAccount();
  const subscriptions = account?.subscriptions || [];
  const { accountSubplebbits } = useAccountSubplebbits();
  const accountSubplebbitAddresses = Object.keys(accountSubplebbits);
  const { showNsfwBoardsOnly, showWorksafeBoardsOnly } = useHomeFiltersStore();

  const { useCatalog } = useHomeFiltersStore();

  const filterSubs = (subs: Subplebbit[], includeTags: string[], excludeTags: string[] = []) =>
    subs.filter((sub) => includeTags.every((tag) => sub.tags?.includes(tag)) && excludeTags.every((tag) => !sub.tags?.includes(tag)));

  let plebbitSubs = filterSubs(multisub, ['plebbit']);
  let interestsSubs = filterSubs(multisub, ['topic'], ['plebbit', 'country', 'international']);
  let randomSubs = filterSubs(multisub, ['random'], ['plebbit']);
  let internationalSubs = filterSubs(multisub, ['international']);
  let projectsSubs = filterSubs(multisub, ['project'], ['plebbit', 'topic']);

  const filterByNsfw = (subs: Subplebbit[], includeNsfw: boolean) => subs.filter((sub) => sub.tags.some((tag: string) => nsfwTags.includes(tag)) === includeNsfw);

  const filterCategoriesByNsfw = (subsArray: Subplebbit[][], includeNsfw: boolean) => subsArray.map((subs) => filterByNsfw(subs, includeNsfw));

  const includeNsfw = showNsfwBoardsOnly ? true : showWorksafeBoardsOnly ? false : null;

  if (includeNsfw !== null) {
    [plebbitSubs, interestsSubs, randomSubs, internationalSubs, projectsSubs] = filterCategoriesByNsfw(
      [plebbitSubs, interestsSubs, randomSubs, internationalSubs, projectsSubs],
      includeNsfw,
    );
  }

  const multisubMetadata = useMultisubMetadata();

  return (
    <div className={`${styles.box} ${styles.boardsBox}`}>
      <div className={styles.boxBar}>
        <h2 className='capitalize'>{t('boards')}</h2>
        <BoxModal isBoardsBoxModal={true} />
      </div>
      <div className={styles.boardsBoxContent}>
        <div className={styles.column}>
          <h3>Multiboards</h3>
          <div className={styles.list}>
            <div className={styles.subplebbit}>
              <Link to={useCatalog ? '/p/all/catalog' : '/p/all'}>{multisubMetadata?.title || 'All'}</Link>
            </div>
            <div className={styles.subplebbit}>
              <Link to={useCatalog ? '/p/subscriptions/catalog' : '/p/subscriptions'}>Subscriptions</Link>
            </div>
          </div>
          {plebbitSubs.length > 0 && (
            <>
              <h3>Plebbit</h3>
              <div className={styles.list}>
                {plebbitSubs.map((sub) => (
                  <Board key={sub.address} subplebbit={sub} subplebbits={subplebbits} />
                ))}
              </div>
            </>
          )}
          {projectsSubs.length > 0 && (
            <>
              <h3>{t('projects')}</h3>
              <div className={styles.list}>
                {projectsSubs.map((sub) => (
                  <Board key={sub.address} subplebbit={sub} subplebbits={subplebbits} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className={styles.column}>
          {interestsSubs.length > 0 && (
            <>
              <h3>{t('interests')}</h3>
              <div className={styles.list}>
                {interestsSubs.map((sub) => (
                  <Board key={sub.address} subplebbit={sub} subplebbits={subplebbits} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className={styles.column}>
          {randomSubs.length > 0 && (
            <>
              <h3>{t('random')}</h3>
              <div className={styles.list}>
                {randomSubs.map((sub) => (
                  <Board key={sub.address} subplebbit={sub} subplebbits={subplebbits} />
                ))}
              </div>
            </>
          )}
          {internationalSubs.length > 0 && (
            <>
              <h3>{t('international')}</h3>
              <div className={styles.list}>
                {internationalSubs.map((sub) => (
                  <Board key={sub.address} subplebbit={sub} subplebbits={subplebbits} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className={styles.column}>
          <div className={styles.list}>
            <h3>{t('subscriptions')}</h3>
            {subscriptions.length > 0
              ? subscriptions.map((address: string, index: number) => (
                  <div className={styles.subplebbit} key={index}>
                    <Link to={useCatalog ? `/p/${address}/catalog` : `/p/${address}`}>p/{address && Plebbit.getShortAddress(address)}</Link>
                  </div>
                ))
              : t('not_subscribed')}
          </div>
          <div className={styles.list}>
            <h3>{t('moderating')}</h3>
            {accountSubplebbitAddresses.length > 0
              ? accountSubplebbitAddresses.map((address: string, index: number) => (
                  <div className={styles.subplebbit} key={index}>
                    <Link to={useCatalog ? `/p/${address}/catalog` : `/p/${address}`}>p/{address && Plebbit.getShortAddress(address)}</Link>
                  </div>
                ))
              : t('not_moderating')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardsBox;
