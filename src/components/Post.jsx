import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
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

const createQuotelink = (handleQuoteClick, comment, children) => {
  const text = children.map((child) => (typeof child === 'string' ? child : child.props.children)).join('');
  const regex = /(\s|^)(c\/[A-Za-z0-9]{12}|c\/[A-Za-z0-9]{45})(?=\s|$)/g;
  const parts = text.split(regex);

  return parts.flatMap((part, i) => {
    if (regex.test(part)) {
      return [
        <Link
          key={`link-${i}`}
          className="quotelink"
          to=""
          onClick={handleQuoteClick}
        >
          {part.trim()}
        </Link>,
      ];
    } else {
      return [part];
    }
  });
};


const Post = ({ content, handleQuoteClick, comment }) => {
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
        p: ({ children }) => (
          <p>{createQuotelink(handleQuoteClick, comment, children)}</p>
        ),
      }}
    />
  );
};

export default Post;