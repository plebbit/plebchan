import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import breaks from 'remark-breaks';
import ForwardRefLink from './ForwardRefLink';


const Post = ({ content, postQuoteOnClick, postQuoteOnOver, postQuoteOnLeave, postQuoteRef }) => {
  const doubleNewlineContent = useMemo(() => content?.replaceAll(/\n(?!\n)/g, '\n\n'), [content]);

  const customSchema = useMemo(() => ({
    ...defaultSchema,
    tagNames: [...defaultSchema.tagNames, 'div'],
    attributes: {
      ...defaultSchema.attributes,
      div: ['className'],
    },
  }), []);


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
    const regexC = /(c\/[A-Za-z0-9]{46}|c\/[A-Za-z0-9]{12})/g;
    const regexP = /(p\/([A-Za-z0-9]{52}|[A-Za-z0-9-.]*\.eth))/g;
    const regexU = /(u\/([A-Za-z0-9]{52}|[A-Za-z0-9-.]*\.eth))/g;
    const regexPC = /(p\/([A-Za-z0-9]{52}|[A-Za-z0-9-.]*\.eth)\/c\/[A-Za-z0-9]{46})/g;  

    const regexArray = [regexU, regexPC, regexP, regexC];
    let parts = [children];

    regexArray.forEach(regex => {
      parts = parts.flatMap((child, i) => {
        if (typeof child === 'string') {
          const newParts = [];
          let match;
          let lastIndex = 0;

          while ((match = regex.exec(child)) !== null) {
            const matchedText = match[0];
            const index = match.index;

            if (index > lastIndex) {
              newParts.push(child.substring(lastIndex, index));
            }

            const cid = matchedText.replace('c/', '');
            const linkRef = React.createRef(); 

            newParts.push(
              <ForwardRefLink
                key={`link-${i}-${matchedText}`}
                className="quotelink"
                to={() => {}}
                ref={linkRef}
                setRefAndCid={(ref) => {
                  if (typeof postQuoteRef === 'function') {
                    postQuoteRef(cid, ref);
                  }
                }}
                onClick={() => {postQuoteOnClick(cid)}}
                onMouseOver={() => {
                  postQuoteOnOver(cid);
                }}
                onMouseLeave={() => {
                  postQuoteOnLeave();
                }}
              >
                {matchedText}
              </ForwardRefLink>
            );

            
            lastIndex = index + matchedText.length;
          }

          if (lastIndex < child.length) {
            newParts.push(child.substring(lastIndex));
          }

          return newParts;
        } else {
          return child;
        }
      });
    });

    return parts;
  };


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
        p: ({ children }) => <div className='custom-paragraph'>
          {createQuotelink(children, postQuoteOnClick, postQuoteOnOver, postQuoteOnLeave, postQuoteRef)}
        </div>,
      }}
    />
  );
};

export default React.memo(Post);