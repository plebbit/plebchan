import React from 'react';
import { useAccountComment } from '@plebbit/plebbit-react-hooks';

const PendingLabel = ({ commentIndex }) => {
  const comment = useAccountComment({ commentIndex: commentIndex });

  if (commentIndex === undefined) return null;

  return comment.cid ? (
    <span>{comment.cid.slice(2, 14)}</span>
  ) : comment.state === 'pending' ? (
    <span style={{ color: 'red', fontWeight: '700' }}>Pending</span>
  ) : comment.state === 'failed' ? (
    <span style={{ color: 'red', fontWeight: '700' }}>Failed</span>
  ) : null;
};

export default PendingLabel;
