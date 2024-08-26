import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import supersub from 'remark-supersub';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { useDismiss, useFloating, useFocus, useHover, useInteractions, offset, shift, size, autoUpdate, Placement, FloatingPortal } from '@floating-ui/react';
import { getLinkMediaInfo, getHasThumbnail } from '../../lib/utils/media-utils';
import { isCatalogView } from '../../lib/utils/view-utils';
import useIsMobile from '../../hooks/use-is-mobile';
import CommentMedia from '../comment-media';
import styles from './markdown.module.css';
import { useLocation, useParams } from 'react-router-dom';

interface ContentLinkEmbedProps {
  children: any;
  href: string;
  linkMediaInfo: any;
}

const ContentLinkEmbed = ({ children, href, linkMediaInfo }: ContentLinkEmbedProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [showMedia, setShowMedia] = useState(false);
  const placementRef = useRef<Placement>('right');
  const availableWidthRef = useRef<number>(0);

  const { refs, floatingStyles, update, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placementRef.current,
    middleware: [
      shift({ padding: 10 }),
      offset({ mainAxis: 5 }),
      size({
        apply({ availableWidth, elements }) {
          availableWidthRef.current = availableWidth;
          if (availableWidth >= 250) {
            elements.floating.style.maxWidth = `${availableWidth - 12}px`;
          } else if (placementRef.current === 'right') {
            placementRef.current = 'left';
          }
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss]);

  useEffect(() => {
    const handleResize = () => {
      const availableWidth = availableWidthRef.current;
      if (availableWidth >= 250) {
        placementRef.current = 'right';
      } else {
        placementRef.current = 'left';
      }
      update();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [update]);

  return (
    <>
      <a href={href} target='_blank' rel='noopener noreferrer'>
        {children}
      </a>{' '}
      [
      <span className={styles.embedButton} onClick={() => setShowMedia(!showMedia)} ref={refs.setReference} {...getReferenceProps()}>
        {showMedia ? t('remove') : isMobile ? t('open') : t('embed')}
      </span>
      ]
      {showMedia && (
        <>
          <br />
          <CommentMedia isReply={false} setShowThumbnail={setShowMedia} commentMediaInfo={linkMediaInfo} showThumbnail={false} />
        </>
      )}
      <FloatingPortal>
        {isOpen && !isMobile && (
          <div className={styles.floatingEmbed} ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            <CommentMedia isReply={false} isFloatingEmbed={true} setShowThumbnail={setShowMedia} commentMediaInfo={linkMediaInfo} showThumbnail={true} />
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

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

interface MarkdownProps {
  content: string;
  title?: string;
}

const Markdown = ({ content, title }: MarkdownProps) => {
  const remarkPlugins: any[] = [[remarkBreaks, supersub]];

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

  const isInCatalogView = isCatalogView(useLocation().pathname, useParams());

  const processedContent = useMemo(() => {
    let md = content;
    if (md) {
      // Preserve newlines in code blocks
      md = md.replace(/```[\s\S]*?```/g, (m) => m.replace(/\n/g, '\n '));
      // Add an extra newline after blockquote lines
      md = md.replace(/^(>.*)\n(?!>)/gm, '$1\n\n');
      // Retain empty lines
      md = md.replace(/(?<=\n\n)(?![*-])\n/g, '&nbsp;\n ');
    }
    return md;
  }, [content]);

  return (
    <span className={styles.markdown}>
      {isInCatalogView && title && (
        <span>
          <b>{title}</b>
          {content ? ': ' : ''}
        </span>
      )}
      <ReactMarkdown
        children={processedContent}
        remarkPlugins={remarkPlugins}
        rehypePlugins={[[rehypeSanitize, customSchema]]}
        components={{
          p: ({ children }) => <p className={isInCatalogView ? styles.inline : ''}>{children}</p>,
          img: ({ src }) => <span>{src}</span>,
          video: ({ src }) => <span>{src}</span>,
          iframe: ({ src }) => <span>{src}</span>,
          source: ({ src }) => <span>{src}</span>,
          hr: () => null,
          a: ({ href, children }) => {
            if (href && !isInCatalogView) {
              const linkMediaInfo = getLinkMediaInfo(href);
              if (getHasThumbnail(linkMediaInfo, href)) {
                return <ContentLinkEmbed children={children} href={href} linkMediaInfo={linkMediaInfo} />;
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
