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
  useMemo,
} from 'react';
import { MDXProvider } from '@mdx-js/react';
import { graphql, Link, navigate } from 'gatsby';
import { useBlogData } from '../../hooks/useBlogData';
import { CommentsContext } from '../../hooks/useComments';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import PostQuery from '../../types/PostQuery';
import useScrollPosition from '../../hooks/useScrollPosition';
import { ContextMenu } from '../ContextMenu';
import Wheel from './Wheel';
import { Ruler } from '../Ruler';
import TagList from '../TagList';
import SEO from '../SEO';
import TOC from '../TOC';
import MetaLink from '../MetaLink';
import ExternalMetaLink from '../ExternalMetaLink';
import Paragraph from './Paragraph/Paragraph';
import Comments from './Comments/Comments';
import Reactions from './PostReactions';
import ExternalLink from './ExternalLink';
import ThematicBreak from '../ThematicBreak';
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
import ParagraphMenu from './Paragraph/ParagraphMenu';
import { Arrow, Tooltip } from '../../components/Tooltip';
import useUserContent from '../../hooks/useUserContent';
import {
  HideTipHandler,
  ShowTipForHandler,
  useTooltip,
} from '../../hooks/useTooltip';
import {
  getDateUnits,
  getDateValue,
  openUrl,
  slugifyHeadings,
} from '../../utils';
import Logs from './Logs';
import ProfileTip from './ProfileTip';
import LocationTip from './LocationTip';
import authors from '../../../authors.json';
import locations from '../../../locations.json';
import Login from '../Login';

// How long to wait before hiding paragraph highlight menu
const HIGHLIGHT_MENU_MOUSEOVER_TIMEOUT = 250;

type AuthorLinkProps = {
  author: string;
  showProfileTipFor: ShowTipForHandler;
  hideProfileTip: HideTipHandler;
};

const AuthorLink: FC<AuthorLinkProps> = ({
  author,
  showProfileTipFor,
  hideProfileTip,
}) => {
  const authorLinkRef = useRef<HTMLElement>(null);
  return (
    <MetaLink
      ref={authorLinkRef}
      to="/about"
      onMouseOver={() => showProfileTipFor(author, authorLinkRef)}
      onMouseOut={hideProfileTip}
    >
      {author}
    </MetaLink>
  );
};

type LocationLinkProps = {
  displayName: string;
  locationUrl: string;
  showLocationTipFor: ShowTipForHandler;
  hideLocationTip: HideTipHandler;
};

const LocationLink: FC<LocationLinkProps> = ({
  displayName,
  locationUrl,
  showLocationTipFor,
  hideLocationTip,
}) => {
  const locationRef = useRef<HTMLElement>(null);

  return (
    <ExternalMetaLink
      ref={locationRef}
      target="_blank"
      rel="noopener noreferrer"
      href={locationUrl}
      onMouseOver={() => showLocationTipFor(displayName, locationRef)}
      onMouseOut={hideLocationTip}
    >
      {displayName}
    </ExternalMetaLink>
  );
};

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
  },
}) => {
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
    targetRef: highlightedParagraphRef,
  } = useTooltip({
    placement: 'top-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const {
    hideTip: hideLoginPopup,
    showTipFor: showLoginPopup,
    tipProps: loginPopupProps,
    tipRef: loginPopupRef,
  } = useTooltip({
    placement: 'top-start',
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
  });

  const {
    hideTip: hideProfileTip,
    showTipFor: showProfileTipFor,
    tipProps: profileTipProps,
    tipRef: profileTipRef,
    tooltipText: profileFor,
  } = useTooltip({
    verticalOffsetDesktop: 6,
    verticalOffsetMobile: 6,
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

  const profile = useMemo(() => {
    if (profileFor === author)
      return {
        userName: author,
        userId: authors[author].userId,
        avatarUrl: authors[author].avatarUrl,
      };

    const commentForProfile =
      profileFor && comments?.find(({ timestamp }) => timestamp === profileFor);

    return (
      commentForProfile && {
        userId: commentForProfile.userId,
        userName: commentForProfile.userName,
        avatarUrl: commentForProfile.avatarUrl,
      }
    );
  }, [profileFor, comments]);

  const location = locationDisplayName && {
    displayName: locationDisplayName,
    avatarUrl: locations[locationDisplayName]?.avatarUrl,
    locationName: locations[locationDisplayName]?.locationName,
    locationUrl: locations[locationDisplayName]?.locationUrl,
    description: locations[locationDisplayName]?.description,
  };

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
        if (!user) {
          // Direct user to login
          hideParagraphMenu();
          showLoginPopup(null, highlightedParagraphRef);
          return;
        }

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

      hideLoginPopup();
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
      showLoginPopup,
      hideLoginPopup,
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

  const handleClearOverlays = useCallback(
    (e) => {
      // Clear login popup
      hideLoginPopup();

      // Clear highlighted paragraph
      if (!highlightedParagraph || e.target.id?.startsWith('p')) return;
      setHighlightedParagraph(null);
    },
    [highlightedParagraph, setHighlightedParagraph, hideLoginPopup]
  );

  useEffect(() => {
    // Clear highlight when another body element was clicked
    document.body.addEventListener('click', handleClearOverlays);
    return () => {
      document.body.removeEventListener('click', handleClearOverlays);
    };
  }, [handleClearOverlays]);

  useEffect(() => {
    // Hide login popup when user is logged in
    if (user) hideLoginPopup();
  }, [user]);

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

      <Logs
        postUrl={absolutePostUrl}
        logs={logs}
        showTipFor={showTipFor}
        hideTip={hideTip}
      />

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
      </ContextMenu>
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
  }
`;

export default Post;
