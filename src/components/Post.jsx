import React from 'react';
import ReactMarkdown from 'react-markdown';
// import { Link } from 'react-router-dom';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import breaks from 'remark-breaks';


const customSchema = {
  ...defaultSchema,
  tagNames: [...defaultSchema.tagNames, 'div'],
  attributes: {
    ...defaultSchema.attributes,
    div: ['className'],
  },
};


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


// const createQuotelink = (handlequoteclick, comment, children) => {
//   const text = children.map((child) => (typeof child === 'string' ? child : child.props.children)).join('');
//   const regex = /(\s|^)(c\/[A-Za-z0-9]{12}|c\/[A-Za-z0-9]{45})(?=\s|$)/g;
//   const parts = text.split(regex);

//   return parts.flatMap((part, i) => {
//     if (regex.test(part)) {
//       return [
//         <Link
//           key={`link-${i}`}
//           className="quotelink"
//           to=""
//           onClick={handlequoteclick}
//         >
//           {part.trim()}
//         </Link>,
//       ];
//     } else {
//       return [part];
//     }
//   });
// };


const Post = ({ content, handlequoteclick, comment }) => {
  const doubleNewlineContent = content?.replaceAll(/\n(?!\n)/g, '\n\n');

  return (
    <ReactMarkdown
      children={doubleNewlineContent}
      remarkPlugins={[blockquoteToGreentext, breaks]}
      rehypePlugins={[[rehypeSanitize, customSchema]]}
      components={{
        img: ({ src }) => <span>{src}</span>,
        video: ({ src }) => <span>{src}</span>,
        source: ({ src }) => <span>{src}</span>,
        gif: ({ src }) => <span>{src}</span>,
        p: ({ children }) => <div className="custom-paragraph">{children}</div>,
      }}
    />
  );
};

export default Post;