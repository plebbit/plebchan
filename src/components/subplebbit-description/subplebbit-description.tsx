import Post from '../post';
import { useTranslation } from 'react-i18next';

interface DescriptionPostProps {
  subplebbitAddress: string | undefined;
  createdAt: number;
  description: string;
  avatarUrl?: string;
  title: string;
}

const SubplebbitDescription = ({ subplebbitAddress, createdAt, description, avatarUrl, title }: DescriptionPostProps) => {
  const { t } = useTranslation();
  const post = {
    isDescription: true,
    subplebbitAddress,
    timestamp: createdAt,
    author: { displayName: '## Board Mods' },
    content: description,
    link: avatarUrl,
    title: t('welcome_to_board', { board: title }),
    pinned: true,
    locked: true,
  };

  return <Post post={post} />;
};

export default SubplebbitDescription;
