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

import React, { FC, useRef, useMemo } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { graphql, Link } from 'gatsby';
import { useBlogContext } from '../../hooks/useBlogContext';
import { CommentsContext } from '../../hooks/useComments';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PostQuery from '../../types/PostQuery';
import useScrollPosition from '../../hooks/useScrollPosition';
import { ContextMenu, ContextMenuArrow } from '../ContextMenu';
import GalleryContext from '../Gallery/GalleryContext';
import Wheel from './Wheel';
import { Ruler } from '../Ruler';
import TagList from '../TagList';
import SEO from '../SEO';
import TOC from '../TOC';
import Paragraph from '../Paragraph/Paragraph';
import Comments from './Comments/Comments';
import Reactions from './PostReactions';
import ExternalLink from './ExternalLink';
import ThematicBreak from '../ThematicBreak';
import AuthorLink from './AuthorLink';
import LocationLink from './LocationLink';
import Blockquote from './Blockquote';
import Code from './Code';
import {
  Main,
  PostHeading,
  PostSummary,
  Metadata,
  Clock,
  InlineIndicator,
  IndicatorLabel,
  AuthorMeta,
  LocationMeta,
  InlineTimeToRead,
  Indicator,
  Sidebar,
  SidebarPanel,
  SidebarMetadata,
  Gauge,
  HeroImage,
  Content,
  Breadcrumb,
  LoginPopup,
} from './Post.styles';
import OrderedList from './OrderedList';
import UnorderedList from './UnorderedList';
import { Heading1, Heading2, Heading3, Heading4 } from '../Heading';
import { Table, TableHeading, TableRow, TableCell } from './Table';
import ParagraphMenu from '../Paragraph/ParagraphMenu';
import { Arrow, Tooltip } from '../../components/Tooltip';
import useUserContent from '../../hooks/useUserContent';
import { useTooltip } from '../../hooks/useTooltip';
import { getDateUnits, getDateValue, slugifyHeadings } from '../../utils';
import useInlineComments from '../../hooks/useInlineComments';
import useAuthorLocation from '../../hooks/useAuthorLocation';
import usePostReactions from '../../hooks/usePostReactions';
import useAuthor from '../../hooks/useAuthor';
import ProfileTip from './ProfileTip';
import LocationTip from './LocationTip';
import Login from '../Login';
import Logs from './Logs';
import ScrollToTop from '../ScrollToTop';
import ShareMenu from './ShareMenu';

const Post: FC<{
  data: PostQuery;
}> = ({
  data: {
    site: {
      siteMetadata: { url: siteUrl },
    },
    post: {
      slug,
      body,
      timeToRead,
      frontmatter: {
        title,
        description,
        image: {
          childImageSharp: { fluid },
        },
        author,
        relativeDate,
        location: locationDisplayName,
      },
      fields: { url: relativePostUrl, collection, subCollection, tags },
      headings,
    },
    project,
    tagGroups: { group },
    logs: { nodes: logs },
    images: { edges: siteImages },
  },
}) => {
  const postContentRef = useRef<HTMLElement>();
  const { readPosition, scrollOffset } = useScrollPosition();
  const location = useAuthorLocation(locationDisplayName);
  const absolutePostUrl = siteUrl + relativePostUrl;

  const {
    user,
    loginError,
    showCommentsSidebar,
    setShowCommentsSidebar,
    handleFacebookLogin,
    handleTwitterLogin,
    handleGoogleLogin,
    handleGithubLogin,
  } = useBlogContext();

  const {
    loading,
    error,
    comments,
    commentCount,
    reactionCount,
    shareCount,
    sharesByType,
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
    handleAddShare,
    handleAdd,
    handleEdit,
    handleDelete,
    handleVote,
    handleReact,
  } = useUserContent(slug);

  const { showTipFor, hideTip, tipProps, tooltipText } = useTooltip({
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 5,
    placement: 'top',
  });

  const {
    hideTip: hideLocationTip,
    showTipFor: showLocationTipFor,
    tipProps: locationTipProps,
  } = useTooltip({
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const {
    profile,
    profileTipProps,
    showProfileTipFor,
    hideProfileTip,
  } = useAuthor(author, comments);

  const {
    handleSnap,
    handleShare,
    handleToggleShareMenu,
    handleHideShareMenu,
    hideShareMenu,
    shareMenuProps,
    shareMenuTargetRef,
  } = usePostReactions({
    user,
    title,
    description,
    absolutePostUrl,
    handleReact,
    handleAddShare,
    hideTip,
  });

  const {
    showParagraphMenu,
    hideParagraphMenu,
    handleToggleInlineComment,
    handleAddInlineComment,
    highlightTimerRef,
    paragraphMenuProps,
    loginPopupProps,
    handleParagraphAction,
    handleParagraphMenuMouseOver,
    handleParagraphMenuMouseOut,
  } = useInlineComments({
    user,
    comments,
    postContentRef,
    showCommentsSidebar,
    highlightedParagraph,
    inlineCommentParagraph,
    paragraphSelection,
    setShowCommentsSidebar,
    setInlineCommentParagraph,
    setInlineCommentSingleMode,
    setParagraphSelection,
    setHighlightedParagraph,
    handleAdd,
  });

  const sourceImages = useMemo(
    () =>
      siteImages.map(
        ({
          node: {
            original: { src: source, width, height },
          },
        }) => ({ source, width, height })
      ),
    [siteImages]
  );

  const tocHeadings = useMemo(
    () => slugifyHeadings(relativePostUrl, headings),
    [relativePostUrl, headings]
  );

  const dateValue = useMemo(() => getDateValue(relativeDate), [relativeDate]);
  const dateUnits = useMemo(() => getDateUnits(relativeDate), [relativeDate]);

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
        ul: UnorderedList,
        ol: OrderedList,
        blockquote: Blockquote,
        a: ExternalLink,
        hr: ThematicBreak,
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

        <PostHeading>
          {subCollection && project ? (
            <Breadcrumb>
              <Link to={project?.fields.url}>{project?.frontmatter.title}</Link>
              {' / '}
            </Breadcrumb>
          ) : null}
          {title}
          {subCollection && ' '}
        </PostHeading>

        <Metadata>
          <Clock />
          <InlineIndicator>{dateValue}</InlineIndicator>
          &nbsp;
          <IndicatorLabel>{dateUnits}</IndicatorLabel>
          &nbsp;
          <AuthorMeta>
            {' by '}
            <AuthorLink {...{ author, showProfileTipFor, hideProfileTip }} />
          </AuthorMeta>
          &nbsp;
          <LocationMeta>
            {' at '}
            <LocationLink
              {...{ ...location, showLocationTipFor, hideLocationTip }}
            />
          </LocationMeta>
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
          handleSnap={handleSnap}
          handleToggleShareMenu={handleToggleShareMenu}
          handleHideShareMenu={handleHideShareMenu}
          hideShareMenu={hideShareMenu}
          shareMenuTargetRef={shareMenuTargetRef}
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

          <TOC
            postUrl={relativePostUrl}
            headings={tocHeadings}
            isProject={collection === 'projects'}
            showLogs={Boolean(logs?.length)}
            readPosition={readPosition}
          />
        </Sidebar>

        <HeroImage fluid={fluid} />

        <PostSummary>{description}</PostSummary>

        <Content role="document" ref={postContentRef}>
          <CommentsContext.Provider
            value={{
              postUrl: relativePostUrl,
              absolutePostUrl,
              comments,
              loading,
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
              showProfileTipFor,
              hideProfileTip,
              showTipFor,
              hideTip,
            }}
          >
            <GalleryContext.Provider value={{ sourceImages }}>
              <MDXRenderer>{body}</MDXRenderer>
            </GalleryContext.Provider>
          </CommentsContext.Provider>

          <ContextMenu {...paragraphMenuProps}>
            <ParagraphMenu
              loading={loading}
              highlights={paragraphHighlightCount}
              comments={paragraphCommentCount}
              onSelect={handleParagraphAction}
              onMouseOver={handleParagraphMenuMouseOver}
              onMouseOut={handleParagraphMenuMouseOut}
            />
          </ContextMenu>

          <ContextMenu {...shareMenuProps}>
            <ShareMenu sharesByType={sharesByType} onSelect={handleShare} />
            <ContextMenuArrow />
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

      <Logs
        postUrl={absolutePostUrl}
        logs={logs}
        showTipFor={showTipFor}
        hideTip={hideTip}
      />

      <Tooltip {...tipProps}>
        {tooltipText}
        <Arrow />
      </Tooltip>

      <Tooltip {...profileTipProps}>
        {profile && <ProfileTip {...profile} />}
        <Arrow />
      </Tooltip>

      <Tooltip {...locationTipProps}>
        <LocationTip {...location} />
        <Arrow />
      </Tooltip>

      <ContextMenu {...loginPopupProps}>
        <LoginPopup>
          <Login
            inline
            action={'highlight'}
            {...{
              handleFacebookLogin,
              handleGoogleLogin,
              handleTwitterLogin,
              handleGithubLogin,
              loginError,
              showTipFor,
              hideTip,
            }}
          />
        </LoginPopup>
        <ContextMenuArrow />
      </ContextMenu>

      <Comments
        slug={slug}
        postUrl={relativePostUrl}
        absolutePostUrl={absolutePostUrl}
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
        showProfileTipFor={showProfileTipFor}
        hideProfileTip={hideProfileTip}
        showTipFor={showTipFor}
        hideTip={hideTip}
      />

      <ScrollToTop
        readPosition={readPosition}
        showCommentsSidebar={showCommentsSidebar}
      />
    </MDXProvider>
  );
};

export const pageQuery = graphql`
  query($slug: String!, $collection: String!, $subCollection: String) {
    site {
      siteMetadata {
        url
      }
    }
    post: mdx(slug: { eq: $slug }) {
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
        author
        relativeDate: date(fromNow: true)
        date(formatString: "MMM DD, YYYY")
        location
        tags
      }
      fields {
        url
        collection
        subCollection
        tags
      }
      headings {
        value
        depth
      }
    }
    project: mdx(slug: { eq: $subCollection }) {
      frontmatter {
        title
      }
      fields {
        url
      }
    }
    tagGroups: allMdx(filter: { fields: { collection: { eq: $collection } } }) {
      group(field: frontmatter___tags) {
        tag: fieldValue
        totalCount
      }
    }
    logs: allMdx(
      filter: { fields: { subCollection: { eq: $slug } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        slug
        timeToRead
        frontmatter {
          title
          description
          relativeDate: date(fromNow: true)
          date(formatString: "MMM DD, YYYY")
          image {
            childImageSharp {
              fluid(maxWidth: 768, maxHeight: 280) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        fields {
          url
        }
      }
    }
    images: allImageSharp {
      edges {
        node {
          original {
            src
            width
            height
          }
        }
      }
    }
  }
`;

export default Post;
