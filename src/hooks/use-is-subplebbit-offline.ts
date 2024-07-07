import { useTranslation } from 'react-i18next';
import { Subplebbit } from '@plebbit/plebbit-react-hooks';
import { getFormattedTimeAgo } from '../lib/utils/time-utils';

const useIsSubplebbitOffline = (subplebbit: Subplebbit) => {
  const { t } = useTranslation();
  const { updatedAt, updatingState } = subplebbit || {};
  const isProbablyOffline = !updatedAt || (updatedAt && updatedAt < Date.now() / 1000 - 60 * 60);
  const isDefinitelyOffline = updatingState === 'failed';
  const isOffline = isProbablyOffline || isDefinitelyOffline;

  const offlineTitle = updatedAt
    ? isOffline && t('posts_last_synced_info', { time: getFormattedTimeAgo(updatedAt), interpolation: { escapeValue: false } })
    : t('subplebbit_offline_info');

  return { isOffline, isDefinitelyOffline, offlineTitle };
};

export default useIsSubplebbitOffline;
