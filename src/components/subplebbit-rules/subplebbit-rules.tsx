import Post from '../post';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

interface RulesPostProps {
  subplebbitAddress: string | undefined;
  createdAt: number;
  rules: string[];
}

const SubplebbitRules = ({ subplebbitAddress, createdAt, rules }: RulesPostProps) => {
  const { t } = useTranslation();
  const content = rules.map((rule, index) => `${index + 1}. ${rule}`).join('\n');
  const post = {
    isRules: true,
    subplebbitAddress,
    timestamp: createdAt,
    author: { displayName: `## ${t('board_mods')}` },
    content,
    title: _.capitalize(t('rules')),
    pinned: true,
    locked: true,
  };

  return <Post post={post} />;
};

export default SubplebbitRules;
