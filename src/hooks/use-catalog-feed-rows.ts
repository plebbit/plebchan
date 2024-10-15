import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { useAccountComments, Subplebbit } from '@plebbit/plebbit-react-hooks';
import useInterfaceSettingsStore from '../stores/use-interface-settings-store';
import { getCommentMediaInfo, getHasThumbnail } from '../lib/utils/media-utils';
import { isAllView } from '../lib/utils/view-utils';
import { useMultisubMetadata } from './use-default-subplebbits';
import _ from 'lodash';

const useCatalogFeedRows = (columnCount: number, feed: any, isFeedLoaded: boolean, subplebbit: Subplebbit) => {
  const { t } = useTranslation();
  const { address, createdAt, description, rules, shortAddress, suggested, title } = subplebbit || {};
  const { avatarUrl } = suggested || {};
  const { hideThreadsWithoutImages } = useInterfaceSettingsStore();

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

    // show account comments instantly in the feed once published (cid defined), instead of waiting for the feed to update
    const filteredComments = accountComments.filter((comment) => {
      const { cid, deleted, link, postCid, removed, state, subplebbitAddress, timestamp } = comment || {};
      const commentMediaInfo = getCommentMediaInfo(comment);
      const isMediaShowed = getHasThumbnail(commentMediaInfo, link);

      return (
        !deleted &&
        !removed &&
        timestamp > Date.now() - 60 * 60 * 1000 &&
        state === 'succeeded' &&
        (!hideThreadsWithoutImages || (hideThreadsWithoutImages && isMediaShowed)) &&
        cid &&
        cid === postCid &&
        subplebbitAddress === address &&
        !_feed.some((feedItem) => feedItem.cid === cid)
      );
    });

    // show newest account comment at the top of the feed but after pinned posts
    const lastPinnedIndex = _feed.map((post) => post.pinned).lastIndexOf(true);
    if (filteredComments.length > 0) {
      _feed.splice(
        lastPinnedIndex + 1,
        0,
        ...filteredComments.map((comment) => ({
          ...comment,
          isAccountComment: true,
        })),
      );
    }

    // add subplebbit description and rules as fake posts at the top of the feed
    if (description && description.length > 0) {
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

    // rules are shown in description thread if both are set
    if (rules && rules.length > 0 && !description) {
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
  }, [accountComments, feed, description, rules, address, isFeedLoaded, createdAt, title, shortAddress, avatarUrl, t, isInAllView, multisub, hideThreadsWithoutImages]);

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
