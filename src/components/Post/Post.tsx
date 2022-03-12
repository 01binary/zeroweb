/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Blog post template.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, {
  useState,
  FC,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
import { MDXProvider } from '@mdx-js/react';
import { graphql } from 'gatsby';
import { useBlogData } from '../../hooks/useBlogData';
import { CommentsContext } from '../../hooks/useComments';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PostQuery from '../../types/PostQuery';
import useScrollPosition from '../../hooks/useScrollPosition';
import { ContextMenu } from '../ContextMenu';
import Wheel from '../Wheel';
import { Ruler } from '../Ruler';
import TagList from '../TagList';
import SEO from '../SEO';
import TOC from '../TOC';
import MetaLink from '../MetaLink';
import Comments from '../Comments/Comments';
import Reactions from '../PostReactions';
import Code from '../Code';
import Paragraph from '../Paragraph/Paragraph';
import Blockquote from '../Blockquote';
import {
  Main,
  PostHeading,
  Metadata,
  Clock,
  InlineIndicator,
  IndicatorLabel,
  Author,
  Location,
  InlineTimeToRead,
  Indicator,
  Sidebar,
  SidebarPanel,
  SidebarMetadata,
  Gauge,
  HeroImage,
  Content,
} from './Post.styles';
import { Heading1, Heading2, Heading3, Heading4 } from '../Heading';
import { Table, TableHeading, TableRow, TableCell } from '../Table';
import useUserContent from '../../hooks/useUserContent';
import { useTooltip } from '../../hooks/useTooltip';
import { Arrow, Tooltip } from '../Tooltip';
import ParagraphMenu from './ParagraphMenu';
import {
  getDateUnits,
  getDateValue,
  openUrl,
  slugifyHeadings,
} from '../../utils';

// How long to wait before hiding paragraph highlight menu
const HIGHLIGHT_MENU_MOUSEOVER_TIMEOUT = 1000;

const AuthorLink = () => <MetaLink to="/about">Valeriy Novytskyy</MetaLink>;

const LocationLink = () => <MetaLink to="#">Portland, OR</MetaLink>;

const Post: FC<{
  data: PostQuery;
}> = ({
  data: {
    site: {
      siteMetadata: { url: siteUrl },
    },
    mdx: {
      slug,
      body,
      timeToRead,
      frontmatter: {
        title,
        description,
        image: {
          childImageSharp: { fluid },
        },
        relativeDate,
      },
      fields: { url: relativePostUrl, collection, tags },
      headings,
    },
    allMdx: { group },
  },
}) => {
  const { user, showCommentsSidebar, setShowCommentsSidebar } = useBlogData();
  const {
    loading,
    error,
    comments,
    commentCount,
    reactionCount,
    handleAdd,
    handleEdit,
    handleDelete,
    handleVote,
    handleReact,
    shareCount,
    sharesByType,
    handleAddShare,
    paragraphSelection,
    highlightedParagraph,
    inlineCommentParagraph,
    inlineCommentSingleMode,
    paragraphHighlightCount,
    paragraphCommentCount,
    setParagraphSelection,
    setHighlightedParagraph,
    setInlineCommentParagraph,
    setInlineCommentSingleMode,
  } = useUserContent(slug);

  const postContentRef = useRef<HTMLElement>(null);
  const highlightTimerRef = useRef<number>(0);
  const [readPosition, setReadPosition] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  useScrollPosition(
    (position, offset) => {
      setReadPosition(position);
      setScrollOffset(offset);
    },
    [readPosition]
  );

  const { showTipFor, hideTip, tipProps, tipRef, tooltipText } = useTooltip({
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 5,
    placement: 'top',
  });

  const {
    hideTip: hideParagraphMenu,
    showTipFor: showParagraphMenu,
    tipProps: paragraphMenuProps,
    tipRef: paragraphMenuRef,
  } = useTooltip({
    placement: 'top-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const absolutePostUrl = `${siteUrl}${relativePostUrl}`;

  const handleSnap = useCallback(
    () =>
      // React to a post
      handleReact({
        userName: user?.name || '',
        avatarUrl: user?.avatarUrl || '',
        parentTimestamp: null,
        reaction: 'snap',
      }),
    [user, handleReact]
  );

  const handleShare = useCallback(
    (shareType) => {
      // Share a post
      switch (shareType) {
        case 'linkShare':
          handleAddShare('link');
          window.navigator.clipboard.writeText(absolutePostUrl);
          break;
        case 'facebookShare':
          handleAddShare('facebook');
          openUrl('https://www.facebook.com/sharer.php', {
            u: absolutePostUrl,
          });
          break;
        case 'twitterShare':
          handleAddShare('twitter');
          openUrl('https://twitter.com/intent/tweet', {
            text: title,
            url: absolutePostUrl,
          });
          break;
        case 'linkedInShare':
          handleAddShare('linkedIn');
          openUrl('https://www.linkedin.com/shareArticle', {
            title,
            url: absolutePostUrl,
            summary: description,
            mini: true,
          });
          break;
        case 'emailShare':
          handleAddShare('email');
          openUrl('mailto:', {
            subject: title,
            body: absolutePostUrl,
          });
          break;
      }
    },
    [handleAddShare, absolutePostUrl]
  );

  const handleToggleInlineComment = useCallback(
    (paragraphHash) => {
      // Toggle inline comment on paragraph in the post
      setShowCommentsSidebar(Boolean(paragraphHash));
      setInlineCommentParagraph(
        paragraphHash
          ? {
              hash: paragraphHash,
              start: paragraphSelection?.start,
              length: paragraphSelection?.length,
            }
          : null
      );
    },
    [
      setInlineCommentParagraph,
      setShowCommentsSidebar,
      paragraphSelection,
      comments,
    ]
  );

  const handleParagraphAction = useCallback(
    (e) => {
      // Handle paragraph context menu command
      const paragraph = highlightedParagraph?.hash || paragraphSelection?.hash;

      if (e.target.id === 'paragraphHighlight') {
        // Add paragraph highlight immediately
        handleAdd({
          paragraph,
          userName: user.name,
          avatarUrl: user.avatarUrl,
          rangeStart: highlightedParagraph?.start || paragraphSelection?.start,
          rangeLength:
            highlightedParagraph?.length || paragraphSelection?.length,
        });
      } else if (e.target.id == 'paragraphComment') {
        // Show inline comment form for the paragraph
        handleToggleInlineComment(paragraph);
      }

      hideParagraphMenu();
      setParagraphSelection(null);
      setHighlightedParagraph(null);
    },
    [
      user,
      highlightedParagraph,
      paragraphSelection,
      handleAdd,
      handleToggleInlineComment,
      setParagraphSelection,
      setHighlightedParagraph,
      hideParagraphMenu,
    ]
  );

  const handleParagraphMenuMouseOver = useCallback(() => {
    // Show paragraph menu when mouse is over a highlighted paragraph
    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = 0;
    }
  }, []);

  const handleParagraphMenuMouseOut = useCallback(() => {
    // Hide paragraph menu when mouse leaves highlighted paragraphs
    if (!highlightTimerRef.current) {
      highlightTimerRef.current = window.setTimeout(() => {
        setHighlightedParagraph(null);
        hideParagraphMenu();
      }, HIGHLIGHT_MENU_MOUSEOVER_TIMEOUT);
    }
  }, [setHighlightedParagraph, hideParagraphMenu]);

  const handleAddInlineComment = useCallback(() => {
    // Request server to add a new inline comment
    if (inlineCommentParagraph?.markdown)
      return handleAdd({
        paragraph: inlineCommentParagraph.hash,
        markdown: inlineCommentParagraph.markdown,
        userName: user.name,
        avatarUrl: user.avatarUrl,
        rangeStart: inlineCommentParagraph.start,
        rangeLength: inlineCommentParagraph.length,
      })
        .then(() => {
          setInlineCommentParagraph(null);
        })
        .catch(() => {
          setInlineCommentParagraph((prev) => ({
            ...prev,
            error: 'Could not comment inline',
          }));
        });
  }, [inlineCommentParagraph, user, handleAdd, setInlineCommentParagraph]);

  const handleClearHighlight = useCallback(
    // Clear highlighted paragraph
    (e) => {
      if (!highlightedParagraph || e.target.id?.startsWith('p')) return;
      setHighlightedParagraph(null);
    },
    [highlightedParagraph, setHighlightedParagraph]
  );

  useEffect(() => {
    // Clear highlight when another body element was clicked
    document.body.addEventListener('click', handleClearHighlight);
    return () => {
      document.body.removeEventListener('click', handleClearHighlight);
    };
  }, [handleClearHighlight]);

  useEffect(
    () => () => {
      // Hide comment sidebar on unmount
      setShowCommentsSidebar(false);
    },
    [setShowCommentsSidebar]
  );

  useLayoutEffect(() => {
    // Collapse inline comments except one being edited if they overlap each other
    if (showCommentsSidebar && comments?.length) {
      let prevBottom = 0;

      const threads = postContentRef.current.querySelectorAll(
        '.paragraph__comment-thread'
      );

      for (let n = 0; n < threads.length; ++n) {
        const { top, bottom } = threads[n].getBoundingClientRect();

        if (top <= prevBottom && prevBottom) {
          setInlineCommentSingleMode(true);
          break;
        }

        prevBottom = bottom;
      }
    } else if (!showCommentsSidebar) {
      setInlineCommentSingleMode(false);
    }
  }, [showCommentsSidebar, inlineCommentParagraph, setInlineCommentSingleMode]);

  return (
    <MDXProvider
      components={{
        h1: Heading1,
        h2: Heading2,
        h3: Heading3,
        h4: Heading4,
        pre: Code,
        table: Table,
        th: TableHeading,
        tr: TableRow,
        td: TableCell,
        p: Paragraph,
        blockquote: Blockquote,
      }}
    >
      <Main showCommentsSidebar={showCommentsSidebar}>
        <SEO
          title={title}
          description={description}
          image={fluid.src}
          url={relativePostUrl}
        />

        <Ruler />

        <PostHeading>{title}</PostHeading>

        <Metadata>
          <Clock />
          {Boolean(getDateValue(relativeDate).length) && (
            <InlineIndicator>
              {getDateValue(relativeDate)}&nbsp;
            </InlineIndicator>
          )}
          <IndicatorLabel>{getDateUnits(relativeDate)}</IndicatorLabel>
          &nbsp;
          <Author>
            {' '}
            by <AuthorLink />
          </Author>
          &nbsp;
          <Location>
            {' '}
            in <LocationLink />
          </Location>
          <InlineTimeToRead>
            {'/ '}
            <Indicator>{timeToRead}</Indicator>
            <span> min </span>
            <IndicatorLabel>to read</IndicatorLabel>
          </InlineTimeToRead>
        </Metadata>

        <Wheel
          postUrl={relativePostUrl}
          showCommentsSidebar={showCommentsSidebar}
          commentCount={commentCount}
          reactionCount={reactionCount}
          shareCount={shareCount}
          sharesByType={sharesByType}
          handleSnap={handleSnap}
          handleShare={handleShare}
        />

        <Sidebar sendToBack={showCommentsSidebar}>
          <SidebarPanel>
            <SidebarMetadata>
              <Gauge position={readPosition} />
              <Indicator>{timeToRead}</Indicator>
              <span> min </span>
              <IndicatorLabel>to read</IndicatorLabel>
            </SidebarMetadata>
            <TagList tags={tags} stats={group} collection={collection} />
            <TagList tags={tags} stats={group} collection={collection} inline />
          </SidebarPanel>

          <TOC headings={slugifyHeadings(relativePostUrl, headings)} />
        </Sidebar>

        <div>{inlineCommentSingleMode ? 'SINGLE MODE' : 'MULTI MODE'}</div>

        <HeroImage fluid={fluid} />

        <Content role="document" ref={postContentRef}>
          <CommentsContext.Provider
            value={{
              postUrl: relativePostUrl,
              comments,
              loading,
              showTipFor,
              hideTip,
              showParagraphMenu,
              hideParagraphMenu,
              highlightedParagraph,
              setHighlightedParagraph,
              paragraphSelection,
              setParagraphSelection,
              inlineCommentParagraph,
              setInlineCommentParagraph,
              toggleInlineComment: handleToggleInlineComment,
              addInlineComment: handleAddInlineComment,
              showCommentsSidebar,
              inlineCommentSingleMode,
              highlightTimerRef,
              postContentRef,
            }}
          >
            <MDXRenderer>{body}</MDXRenderer>
          </CommentsContext.Provider>

          <ContextMenu ref={paragraphMenuRef} {...paragraphMenuProps}>
            <ParagraphMenu
              loading={loading}
              highlights={paragraphHighlightCount}
              comments={paragraphCommentCount}
              onSelect={handleParagraphAction}
              onMouseOver={handleParagraphMenuMouseOver}
              onMouseOut={handleParagraphMenuMouseOut}
            />
          </ContextMenu>
        </Content>

        <Reactions
          reactionCount={reactionCount}
          shareCount={shareCount}
          sharesByType={sharesByType}
          handleSnap={handleSnap}
          handleShare={handleShare}
        />
      </Main>

      <Comments
        slug={slug}
        postUrl={relativePostUrl}
        loading={loading}
        error={error}
        comments={comments}
        handleVote={handleVote}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleReact={handleReact}
        readPosition={readPosition}
        scrollOffset={scrollOffset}
      />

      <Tooltip ref={tipRef} {...tipProps}>
        {tooltipText}
        <Arrow />
      </Tooltip>
    </MDXProvider>
  );
};

export const pageQuery = graphql`
  query($slug: String!, $collection: String!) {
    site {
      siteMetadata {
        url
      }
    }
    mdx(slug: { eq: $slug }) {
      slug
      body
      timeToRead
      frontmatter {
        title
        description
        image {
          childImageSharp {
            fluid(maxWidth: 768, maxHeight: 280) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        relativeDate: date(fromNow: true)
        date(formatString: "MMM DD, YYYY")
        tags
      }
      fields {
        url
        collection
        tags
      }
      headings {
        value
        depth
      }
    }
    allMdx(filter: { fields: { collection: { eq: $collection } } }) {
      group(field: frontmatter___tags) {
        tag: fieldValue
        totalCount
      }
    }
  }
`;

export default Post;
