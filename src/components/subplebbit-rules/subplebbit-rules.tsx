import Post from '../post';

interface RulesPostProps {
  subplebbitAddress: string | undefined;
  createdAt: number;
  rules: string[];
}

const SubplebbitRules = ({ subplebbitAddress, createdAt, rules }: RulesPostProps) => {
  const content = rules.map((rule, index) => `${index + 1}. ${rule}`).join('\n');
  const post = {
    isRules: true,
    subplebbitAddress,
    timestamp: createdAt,
    author: { displayName: '## Board Mods' },
    content,
    title: 'Rules',
    pinned: true,
    locked: true,
  };

  return <Post post={post} />;
};

export default SubplebbitRules;
