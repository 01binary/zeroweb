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

import React, { useState, FC, useCallback, useEffect, useRef } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { graphql } from 'gatsby';
import { useBlogData } from '../../hooks/useBlogData';
import {
  CommentsContext,
  ParagraphSelection,
  ParagraphHighlight,
  ParagraphComment,
} from '../../hooks/useComments';
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
import {
  getDateUnits,
  getDateValue,
  openUrl,
  slugifyHeadings,
} from '../../utils';
import { useTooltip } from '../../hooks/useTooltip';
import { Arrow, Tooltip } from '../Tooltip';
import ParagraphMenu from './ParagraphMenu';

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
  } = useUserContent(slug);

  const { user, showCommentsSidebar, setShowCommentsSidebar } = useBlogData();

  const [
    paragraphSelection,
    setParagraphSelection,
  ] = useState<ParagraphSelection | null>(null);

  const [
    highlightedParagraph,
    setHighlightedParagraph,
  ] = useState<ParagraphHighlight | null>(null);

  const [
    inlineCommentParagraph,
    setInlineCommentParagraph,
  ] = useState<ParagraphComment | null>(null);

  const paragraphMetadata =
    paragraphSelection?.hash || highlightedParagraph?.hash;

  const paragraphHighlightCount =
    comments && paragraphMetadata
      ? comments?.filter(
          ({ paragraph, markdown }) =>
            paragraph === paragraphMetadata && !markdown
        )?.length
      : 0;

  const paragraphCommentCount =
    comments && paragraphMetadata
      ? comments?.filter(
          ({ paragraph, markdown }) =>
            paragraph === paragraphMetadata && markdown
        )?.length
      : 0;

  const absolutePostUrl = `${siteUrl}${relativePostUrl}`;

  const handleSnap = useCallback(() => {
    handleReact({
      userName: user?.name || '',
      avatarUrl: user?.avatarUrl || '',
      parentTimestamp: null,
      reaction: 'snap',
    });
  }, [user, handleReact]);

  const handleShare = useCallback(
    (shareType) => {
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
          window.open(`mailto:?subject=${title}&body=${absolutePostUrl}`);
          break;
      }
    },
    [handleAddShare]
  );

  const handleParagraphAction = useCallback(
    (e) => {
      const paragraph = highlightedParagraph?.hash || paragraphSelection?.hash;

      if (e.target.id === 'paragraphHighlight') {
        handleAdd({
          paragraph,
          userName: user.name,
          avatarUrl: user.avatarUrl,
          rangeStart: highlightedParagraph?.start || paragraphSelection?.start,
          rangeLength:
            highlightedParagraph?.length || paragraphSelection?.length,
        });
      } else if (e.target.id == 'paragraphComment') {
        setShowCommentsSidebar(true);
        setInlineCommentParagraph({
          hash: paragraph,
          start: paragraphSelection?.start,
          length: paragraphSelection?.length,
        });
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
      setShowCommentsSidebar,
      setInlineCommentParagraph,
      setParagraphSelection,
      setHighlightedParagraph,
      hideParagraphMenu,
    ]
  );

  const handleParagraphMenuMouseOver = useCallback(() => {
    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = 0;
    }
  }, []);

  const handleParagraphMenuMouseOut = useCallback(() => {
    if (!highlightTimerRef.current) {
      highlightTimerRef.current = window.setTimeout(() => {
        setHighlightedParagraph(null);
        hideParagraphMenu();
      }, HIGHLIGHT_MENU_MOUSEOVER_TIMEOUT);
    }
  }, [setHighlightedParagraph, hideParagraphMenu]);

  const handleAddInlineComment = useCallback(() => {
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

  const handleToggleInlineComment = useCallback(
    (paragraphHash) => {
      setInlineCommentParagraph(paragraphHash);
      setShowCommentsSidebar(Boolean(paragraphHash));
    },
    [setInlineCommentParagraph, setShowCommentsSidebar]
  );

  const handleClearHighlight = useCallback(
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

        <HeroImage fluid={fluid} />

        <Content role="document">
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
              setInlineCommentParagraph: handleToggleInlineComment,
              addInlineComment: handleAddInlineComment,
              showCommentsSidebar,
              highlightTimerRef,
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
