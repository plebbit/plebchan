import Post from '../post';
import { useTranslation } from 'react-i18next';

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
  const post = {
    isDescription: true,
    subplebbitAddress,
    timestamp: createdAt,
    author: { displayName: '## Board Mods' },
    content: description,
    link: avatarUrl,
    title: t('welcome_to_board', { board: title || `p/${shortAddress}` }),
    pinned: true,
    locked: true,
  };

  return <Post post={post} />;
};

export default SubplebbitDescription;
