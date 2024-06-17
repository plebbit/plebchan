import { Post } from '../../views/post';
import { useTranslation } from 'react-i18next';
import { isAllView } from '../../lib/utils/view-utils';
import { useMultisubMetadata } from '../../hooks/use-default-subplebbits';
import { useLocation, useParams } from 'react-router-dom';

interface DescriptionPostProps {
  avatarUrl?: string;
  createdAt: number;
  description: string;
  shortAddress: string;
  subplebbitAddress: string | undefined;
  title: string;
}

const SubplebbitDescription = ({ avatarUrl, createdAt, description, shortAddress, subplebbitAddress, title }: DescriptionPostProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isInAllView = isAllView(location.pathname, useParams());
  const multisubMetadata = useMultisubMetadata();

  const post = {
    isDescription: true,
    subplebbitAddress,
    timestamp: isInAllView ? multisubMetadata?.createdAt : createdAt,
    author: { displayName: `## ${t('board_mods')}` },
    content: isInAllView ? multisubMetadata?.description : description,
    link: avatarUrl,
    title: t('welcome_to_board', {
      board: isInAllView ? multisubMetadata?.title : title || `p/${shortAddress}`,
      interpolation: { escapeValue: false },
    }),
    pinned: true,
    locked: true,
  };

  return <Post post={post} />;
};

export default SubplebbitDescription;
