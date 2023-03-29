import React from 'react';
import ReactMarkdown from 'react-markdown';
import { visit } from 'unist-util-visit';
import DOMPurify from 'dompurify';

const blockquoteToGreentext = () => (tree) => {
  visit(tree, 'blockquote', (node) => {
    node.children.forEach((child) => {
      if (child.type === 'paragraph' && child.children.length > 0) {
        const prefix = {
          type: 'text',
          value: '>',
        };
        child.children.unshift(prefix);
      }
    });
    node.type = 'div';
    node.data = {
      hName: 'div',
      hProperties: {
        className: 'greentext',
      },
    };
  });
};

const Post = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <ReactMarkdown
      children={sanitizedContent}
      remarkPlugins={[blockquoteToGreentext]}
      components={{
        img: () => null,
        video: () => null,
        source: () => null,
        gif: () => null,
      }}
    />
  );
};

export default Post;