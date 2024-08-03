import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { useAccountComments, Subplebbit } from '@plebbit/plebbit-react-hooks';
import { isAllView } from '../lib/utils/view-utils';
import { useMultisubMetadata } from './use-default-subplebbits';
import useCatalogFiltersStore from '../stores/use-catalog-filters-store';
import _ from 'lodash';
import { getCommentMediaInfo, getHasThumbnail } from '../lib/utils/media-utils';

const useCatalogFeedRows = (columnCount: number, feed: any, isFeedLoaded: boolean, subplebbit: Subplebbit) => {
  const { t } = useTranslation();
  const { address, createdAt, description, rules, shortAddress, suggested, title } = subplebbit || {};
  const { avatarUrl } = suggested || {};
  const { showTextOnlyThreads } = useCatalogFiltersStore();

  const location = useLocation();
  const isInAllView = isAllView(location.pathname, useParams());
  const multisub = useMultisubMetadata();

  const { accountComments } = useAccountComments();

  const feedWithFakePostsOnTop = useMemo(() => {
    if (!isFeedLoaded) {
      return []; // prevent rules and description from appearing while feed is loading
    }

    if (!description && !rules && !isInAllView) {
      return feed;
    }

    const _feed = [...feed];

    // show account comments instantly in the feed instead of waiting for the next feed update, then hide them when they are in the feed
    accountComments.forEach((comment) => {
      const { cid, deleted, link, postCid, removed, state, subplebbitAddress } = comment || {};
      const commentMediaInfo = getCommentMediaInfo(comment);
      const isMediaShowed = getHasThumbnail(commentMediaInfo, link);

      if (
        !deleted &&
        !removed &&
        state === 'succeeded' &&
        (!showTextOnlyThreads || (showTextOnlyThreads && !isMediaShowed)) &&
        cid &&
        cid === postCid &&
        subplebbitAddress === address &&
        !_feed.some((feedItem) => feedItem.cid === cid)
      ) {
        _feed.unshift({
          ...comment,
          isAccountComment: true,
        });
      }
    });

    if ((description && description.length > 0 && (showTextOnlyThreads || (!showTextOnlyThreads && suggested?.avatarUrl))) || isInAllView) {
      _feed.unshift({
        isDescription: true,
        subplebbitAddress: address,
        timestamp: createdAt,
        author: { displayName: `## ${t('board_mods')}` },
        content: isInAllView ? multisub?.description : description,
        link: avatarUrl,
        title: t('welcome_to_board', { board: isInAllView ? multisub?.title : title || `p/${shortAddress}`, interpolation: { escapeValue: false } }),
        pinned: true,
        locked: true,
      });
    }

    if (rules && rules.length > 0 && showTextOnlyThreads) {
      _feed.unshift({
        isRules: true,
        subplebbitAddress: address,
        timestamp: createdAt,
        author: { displayName: `## ${t('board_mods')}` },
        content: rules.map((rule: string, index: number) => `${index + 1}. ${rule}`).join('\n'),
        title: _.capitalize(t('rules')),
        pinned: true,
        locked: true,
      });
    }

    return _feed;
  }, [
    accountComments,
    feed,
    description,
    rules,
    address,
    isFeedLoaded,
    createdAt,
    title,
    shortAddress,
    avatarUrl,
    t,
    isInAllView,
    multisub,
    showTextOnlyThreads,
    suggested?.avatarUrl,
  ]);

  const rows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < feedWithFakePostsOnTop.length; i += columnCount) {
      rows.push(feedWithFakePostsOnTop.slice(i, i + columnCount));
    }
    return rows;
  }, [feedWithFakePostsOnTop, columnCount]);

  return rows;
};

export default useCatalogFeedRows;
