import { useComment } from '@plebbit/plebbit-react-hooks';

const DisplayName = ({ commentCid }) => {
  const comment = useComment({ commentCid });

  return <span>{comment?.author?.displayName ?? 'Anonymous'}</span>;
};

export default DisplayName;
