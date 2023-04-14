import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const blockquoteToGreentext = () => (tree) => {
  tree.children.forEach((node) => {
    if (node.type === 'blockquote') {
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
    }
  });
};

const createQuotelink = (handlequoteclick, comment, children) => {
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
          onClick={handlequoteclick}
        >
          {part.trim()}
        </Link>,
      ];
    } else {
      return [part];
    }
  });
};


const Post = ({ content, handlequoteclick, comment }) => {
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
          <p>{createQuotelink(handlequoteclick, comment, children)}</p>
        ),
      }}
    />
  );
};

export default Post;