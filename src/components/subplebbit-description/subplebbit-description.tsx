import Post from '../post';

interface DescriptionPostProps {
  subplebbitAddress: string | undefined;
  createdAt: number;
  description: string;
  avatarUrl?: string;
  title: string;
}

const SubplebbitDescription = ({ subplebbitAddress, createdAt, description, avatarUrl, title }: DescriptionPostProps) => {
  const post = {
    isDescription: true,
    subplebbitAddress,
    timestamp: createdAt,
    author: { displayName: '## Board Mods' },
    content: description,
    link: avatarUrl,
    title: 'Welcome to ' + title,
    pinned: true,
    locked: true,
  };

  return <Post post={post} />;
};

export default SubplebbitDescription;
