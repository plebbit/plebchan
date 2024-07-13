import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Subplebbit } from '@plebbit/plebbit-react-hooks';
import { getFormattedTimeAgo } from '../lib/utils/time-utils';
import useSubplebbitOfflineStore from '../stores/use-subplebbit-offline-store';

const useIsSubplebbitOffline = (subplebbit: Subplebbit) => {
  const { t } = useTranslation();
  const { address, state, updatedAt, updatingState } = subplebbit || {};
  const { subplebbitOfflineState, setSubplebbitOfflineState, initializesubplebbitOfflineState } = useSubplebbitOfflineStore();

  useEffect(() => {
    if (address && !subplebbitOfflineState[address]) {
      initializesubplebbitOfflineState(address);
    }
  }, [address, subplebbitOfflineState, initializesubplebbitOfflineState]);

  useEffect(() => {
    if (address) {
      setSubplebbitOfflineState(address, { state, updatedAt, updatingState });
    }
  }, [address, state, updatedAt, updatingState, setSubplebbitOfflineState]);

  const subplebbitOfflineStore = subplebbitOfflineState[address] || { initialLoad: true };

  const isLoading =
    updatingState === 'resolving-address' ||
    (updatingState === 'stopped' && state === 'stopped' && !updatedAt) ||
    (subplebbitOfflineStore.initialLoad && updatingState === 'fetching-ipns' && !updatedAt);

  const isOffline =
    !isLoading && ((updatedAt && updatedAt < Date.now() / 1000 - 60 * 60) || updatingState === 'failed' || (updatingState === 'fetching-ipns' && !updatedAt));

  const offlineIconClass = isLoading ? 'yellowOfflineIcon' : isOffline ? 'redOfflineIcon' : '';

  const offlineTitle = isLoading
    ? t('loading')
    : updatedAt
    ? isOffline && t('posts_last_synced_info', { time: getFormattedTimeAgo(updatedAt), interpolation: { escapeValue: false } })
    : t('subplebbit_offline_info');

  return { isOffline, isOnlineStatusLoading: isLoading, offlineIconClass, offlineTitle };
};

export default useIsSubplebbitOffline;
