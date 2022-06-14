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

import React, { useState, FC, useRef, useMemo } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { graphql, Link } from 'gatsby';
import { useBlogData } from '../../hooks/useBlogData';
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
  const postContentRef = useRef<HTMLElement>(null);
  const [readPosition, setReadPosition] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const location = useAuthorLocation(locationDisplayName);
  const absolutePostUrl = siteUrl + relativePostUrl;

  useScrollPosition(
    (position, offset) => {
      setReadPosition(position);
      setScrollOffset(offset);
    },
    [readPosition]
  );

  const {
    user,
    loginError,
    showCommentsSidebar,
    setShowCommentsSidebar,
    handleFacebookLogin,
    handleTwitterLogin,
    handleGoogleLogin,
    handleGithubLogin,
  } = useBlogData();

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

  const { showTipFor, hideTip, tipProps, tipRef, tooltipText } = useTooltip({
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 5,
    placement: 'top',
  });

  const {
    hideTip: hideLocationTip,
    showTipFor: showLocationTipFor,
    tipProps: locationTipProps,
    tipRef: locationTipRef,
  } = useTooltip({
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const {
    profile,
    profileTipRef,
    profileTipProps,
    showProfileTipFor,
    hideProfileTip,
  } = useAuthor(author, comments);

  const { handleSnap, handleShare } = usePostReactions({
    user,
    title,
    description,
    absolutePostUrl,
    handleReact,
    handleAddShare,
  });

  const {
    showParagraphMenu,
    hideParagraphMenu,
    handleToggleInlineComment,
    handleAddInlineComment,
    highlightTimerRef,
    paragraphMenuRef,
    paragraphMenuProps,
    loginPopupRef,
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
          {Boolean(getDateValue(relativeDate).length) && (
            <InlineIndicator>
              {getDateValue(relativeDate)}&nbsp;
            </InlineIndicator>
          )}
          <IndicatorLabel>{getDateUnits(relativeDate)}</IndicatorLabel>
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

          <TOC
            postUrl={relativePostUrl}
            headings={slugifyHeadings(relativePostUrl, headings)}
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

      <Logs
        postUrl={absolutePostUrl}
        logs={logs}
        showTipFor={showTipFor}
        hideTip={hideTip}
      />

      <Tooltip ref={tipRef} {...tipProps}>
        {tooltipText}
        <Arrow />
      </Tooltip>

      <Tooltip ref={profileTipRef} {...profileTipProps}>
        {profile && <ProfileTip {...profile} />}
        <Arrow />
      </Tooltip>

      <Tooltip ref={locationTipRef} {...locationTipProps}>
        <LocationTip {...location} />
        <Arrow />
      </Tooltip>

      <ContextMenu ref={loginPopupRef} {...loginPopupProps}>
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
    logs: allMdx(filter: { fields: { subCollection: { eq: $slug } } }) {
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
