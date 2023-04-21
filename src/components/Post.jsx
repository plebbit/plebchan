import React from 'react';
import DOMPurify from 'dompurify';

const Post = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  const lines = sanitizedContent.split(/(?:\r\n|\r|\n)/);
  const greentextLines = lines.map((line, index) => {
    if (line.startsWith('>')) {
      return <div className="greentext" key={`gt-${index}`}>{line}</div>;
    } else if (line === '') {
      return <div key={`empty-${index}`}>&nbsp;</div>;
    }
    return <div key={`line-${index}`}>{line}</div>;
  });

  return <>{greentextLines}</>;
};

export default Post;