import React from 'react';
import { useAccountComment } from '@plebbit/plebbit-react-hooks';
import useStateString from '../hooks/useStateString';

const StateLabel = ({ commentIndex, className }) => {
  const comment = useAccountComment({ commentIndex: commentIndex });
  const stateString = useStateString(comment);

  if (comment.updatedAt !== undefined || comment.index === undefined) {
    return null;
  }

  if (comment.state === 'failed' || comment.state === 'succeeded') {
    return null;
  }

  if (!stateString) {
    return null;
  }

  return (
    <span className='ttl'>
      <br />(<span className={className}>{stateString}</span>)
    </span>
  );
};

export default StateLabel;
