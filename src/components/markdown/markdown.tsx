import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import supersub from 'remark-supersub';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import styles from './markdown.module.css';
import { useTranslation } from 'react-i18next';
import { getLinkMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import CommentMedia from '../comment-media';

interface MarkdownProps {
  content: string;
}

const MAX_LENGTH_FOR_GFM = 10000; // remarkGfm lags with large content

const blockquoteToGreentext = () => (tree: any) => {
  tree.children.forEach((node: any) => {
    if (node.type === 'blockquote') {
      node.children.forEach((child: any) => {
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

const Markdown = ({ content }: MarkdownProps) => {
  const remarkPlugins: any[] = [[supersub]];

  if (content && content.length <= MAX_LENGTH_FOR_GFM) {
    remarkPlugins.push([remarkGfm, { singleTilde: false }]);
  }

  const customSchema = useMemo(
    () => ({
      ...defaultSchema,
      tagNames: [...(defaultSchema.tagNames || []), 'div'],
      attributes: {
        ...defaultSchema.attributes,
        div: ['className'],
      },
    }),
    [],
  );

  remarkPlugins.push([blockquoteToGreentext]);

  const { t } = useTranslation();
  const [showMedia, setShowMedia] = useState(false);

  return (
    <span className={styles.markdown}>
      <ReactMarkdown
        children={content}
        remarkPlugins={remarkPlugins}
        rehypePlugins={[[rehypeSanitize, customSchema]]}
        components={{
          img: ({ src }) => <span>{src}</span>,
          video: ({ src }) => <span>{src}</span>,
          iframe: ({ src }) => <span>{src}</span>,
          source: ({ src }) => <span>{src}</span>,
          hr: () => (
            <div className={styles.hrWrapper}>
              <hr />
            </div>
          ),
          a: ({ href, children }) => {
            if (href) {
              const linkMediaInfo = getLinkMediaInfo(href);
              if (getHasThumbnail(linkMediaInfo, href)) {
                return (
                  <>
                    <a href={href} target='_blank' rel='noopener noreferrer'>
                      {children}
                    </a>{' '}
                    [
                    <span className={styles.embedButton} onClick={() => setShowMedia(!showMedia)}>
                      {showMedia ? t('remove') : t('embed')}
                    </span>
                    ]
                    {showMedia && (
                      <>
                        <br />
                        <CommentMedia isReply={false} setShowThumbnail={setShowMedia} commentMediaInfo={linkMediaInfo} showThumbnail={false} />
                      </>
                    )}
                  </>
                );
              } else {
                return (
                  <a href={href} target='_blank' rel='noopener noreferrer'>
                    {children}
                  </a>
                );
              }
            }
          },
        }}
      />
    </span>
  );
};

export default React.memo(Markdown);
