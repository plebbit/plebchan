import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Subplebbit } from '@plebbit/plebbit-react-hooks';
import { getFormattedTimeAgo } from '../lib/utils/time-utils';
import useSubplebbitOfflineStore from '../stores/use-subplebbit-offline-store';
import useSubplebbitsLoadingStartTimestamps from './use-subplebbits-loading-start-timestamps-store';

const useIsSubplebbitOffline = (subplebbit: Subplebbit) => {
  const { t } = useTranslation();
  const { address, state, updatedAt, updatingState } = subplebbit || {};
  const { subplebbitOfflineState, setSubplebbitOfflineState, initializesubplebbitOfflineState } = useSubplebbitOfflineStore();
  const subplebbitsLoadingStartTimestamps = useSubplebbitsLoadingStartTimestamps([address]);

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
  const loadingStartTimestamp = subplebbitsLoadingStartTimestamps[0] || 0;

  const isLoading = subplebbitOfflineStore.initialLoad && (!updatedAt || Date.now() / 1000 - updatedAt >= 60 * 60) && Date.now() / 1000 - loadingStartTimestamp < 30;

  const isOffline = !isLoading && ((updatedAt && updatedAt < Date.now() / 1000 - 60 * 60) || (!updatedAt && Date.now() / 1000 - loadingStartTimestamp >= 30));

  const isOnline = updatedAt && Date.now() / 1000 - updatedAt < 60 * 60;
  const offlineIconClass = isLoading ? 'yellowOfflineIcon' : isOffline ? 'redOfflineIcon' : '';

  const offlineTitle = isLoading
    ? t('loading')
    : updatedAt
    ? isOffline && t('posts_last_synced_info', { time: getFormattedTimeAgo(updatedAt), interpolation: { escapeValue: false } })
    : t('subplebbit_offline_info');

  return { isOffline: !isOnline && isOffline, isOnlineStatusLoading: !isOnline && isLoading, offlineIconClass, offlineTitle };
};

export default useIsSubplebbitOffline;
