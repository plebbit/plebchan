import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import breaks from 'remark-breaks';
import ForwardRefLink from './ForwardRefLink';

const Post = ({ content, postQuoteOnClick, postQuoteOnOver, postQuoteOnLeave, postQuoteRef }) => {
  const doubleNewlineContent = content?.replace(/\n/g, '&nbsp;\n\n');

  const customSchema = useMemo(
    () => ({
      ...defaultSchema,
      tagNames: [...defaultSchema.tagNames, 'div'],
      attributes: {
        ...defaultSchema.attributes,
        div: ['className'],
      },
    }),
    [],
  );

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

  const createQuotelink = (children, postQuoteOnClick, postQuoteOnOver, postQuoteOnLeave, postQuoteRef) => {
    const patternC = '(c/[A-Za-z0-9]{46}|c/[A-Za-z0-9]{12})';
    const patternP = '(p/([A-Za-z0-9]{52}|[A-Za-z0-9-.]*\\.eth))';
    const patternU = '(u/([A-Za-z0-9]{52}|[A-Za-z0-9-.]*\\.eth))';
    const patternPC = '(p/([A-Za-z0-9]{52}|[A-Za-z0-9-.]*\\.eth)/c/[A-Za-z0-9]{46})';

    const regex = new RegExp(`${patternC}|${patternPC}|${patternU}|${patternP}`, 'g');

    return children?.flatMap((child, i) => {
      if (typeof child !== 'string') {
        return child;
      }

      const parts = [];
      let match;
      let lastIndex = 0;

      while ((match = regex.exec(child)) !== null) {
        const matchedText = match[0];
        const index = match.index;

        if (index > lastIndex) {
          parts.push(child.substring(lastIndex, index));
        }

        const cid = matchedText.replace('c/', '');
        const linkRef = React.createRef();

        let linkTo = () => {};
        const linkTarget = matchedText.startsWith('u/') ? '_blank' : '_self';

        if (matchedText.startsWith('u/')) {
          linkTo = '#void';
        } else if (matchedText.startsWith('p/') || matchedText.startsWith('p/')) {
          linkTo = `/${matchedText}`;
        }

        parts.push(
          <ForwardRefLink
            key={`quotelink-${i}-${lastIndex}`}
            className='quotelink'
            to={linkTo}
            target={linkTarget}
            ref={linkRef}
            setRefAndCid={(ref) => {
              if (typeof postQuoteRef === 'function') {
                postQuoteRef(cid, ref);
              }
            }}
            onClick={() => {
              postQuoteOnClick(cid);
            }}
            onMouseOver={() => {
              postQuoteOnOver(cid);
            }}
            onMouseLeave={() => {
              postQuoteOnLeave();
            }}
          >
            {matchedText}
          </ForwardRefLink>,
        );

        lastIndex = index + matchedText.length;
      }

      if (lastIndex < child.length) {
        parts.push(child.substring(lastIndex));
      }

      return parts;
    });
  };

  return (
    <ReactMarkdown
      children={doubleNewlineContent}
      remarkPlugins={[blockquoteToGreentext, breaks]}
      rehypePlugins={[[rehypeSanitize, customSchema]]}
      components={{
        a: ({ children, href }) => <span>{`[${children}](${href})`}</span>,
        img: ({ src }) => <span>{src}</span>,
        video: ({ src }) => <span>{src}</span>,
        source: ({ src }) => <span>{src}</span>,
        gif: ({ src }) => <span>{src}</span>,
        p: ({ children }) => <div className='custom-paragraph'>{createQuotelink(children, postQuoteOnClick, postQuoteOnOver, postQuoteOnLeave, postQuoteRef)}</div>,
      }}
    />
  );
};

export default React.memo(Post);
