import React, { FC, useRef, useState } from 'react';
import styled from 'styled-components';
import { MDXProvider } from '@mdx-js/react';
import Title from '../components/Title';
import { Heading1, Heading2, Heading3, Heading4 } from './Heading';
import { Table, TableHeading, TableRow, TableCell } from './Post/Table';
import { MOBILE } from '../constants';
import UnorderedList from './Post/UnorderedList';
import OrderedList from './Post/OrderedList';
import Blockquote from './Post/Blockquote';
import ExternalLink from './Post/ExternalLink';
import ThematicBreak from './ThematicBreak';
import SiteMetadataQuery from '../types/SiteMetadataQuery';
import { useTooltip } from '../hooks/useTooltip';
import { Arrow, Tooltip } from './Tooltip';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import useUserContent from '../hooks/useUserContent';
import useInlineComments from '../hooks/useInlineComments';
import { useBlogData } from '../hooks/useBlogData';
import SEO from './SEO';
import { CommentsContext } from '../hooks/useComments';
import ProfileTip from './Post/ProfileTip';
import useAuthor from '../hooks/useAuthor';
import { ContextMenu, ContextMenuArrow } from './ContextMenu';
import ParagraphMenu from './Paragraph/ParagraphMenu';
import { LoginPopup } from './Post/Post.styles';
import Login from './Login';
import useScrollPosition from '../hooks/useScrollPosition';
import Comments from './Post/Comments/Comments';
import usePostReactions from '../hooks/usePostReactions';
import Wheel from './Post/Wheel';

const PageTitle = styled(Title)`
  margin-bottom: calc(0px - ${(props) => props.theme.spacingHalf});

  @media (max-width: ${MOBILE}) {
    margin-bottom: initial;
  }
`;

const Paragraph = styled.p`
  margin-left: calc(${(props) => props.theme.spacing} * 5);

  @media (max-width: ${MOBILE}) {
    max-width: 100%;
    margin-left: ${(props) => props.theme.spacingHalf};
  }
`;

const Main = styled.main`
  margin-bottom: calc(${(props) => props.theme.spacing} * 2.5);

  animation: slideIn ${(props) => props.theme.animationSlow} ease-out 1;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media (max-width: ${MOBILE}) {
    margin-bottom: initial;
  }
`;

const Content = styled.section`
  opacity: 0;
  animation: slideIn ${(props) => props.theme.animationSlow} 0.2s ease-out 1;
  animation-fill-mode: forwards;

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

export type PageQuery = {
  data: {
    page: {
      slug: string;
      body?: string;
      frontmatter: {
        title: string;
        seoTitle?: string;
        description: string;
        collection: string;
        image?: {
          childImageSharp: {
            fluid: { src: string };
          };
        };
      };
      fields: {
        url: string;
      };
    };
    site: {
      siteMetadata: SiteMetadataQuery;
    };
  };
};

const Page: FC<PageQuery> = ({
  children,
  data: {
    site: {
      siteMetadata: { url: siteUrl },
    },
    page: {
      slug,
      body,
      frontmatter: { title, seoTitle, description, collection, image },
      fields: { url: relativePostUrl },
    },
  },
}) => {
  const absolutePostUrl = siteUrl + relativePostUrl;
  const pageContentRef = useRef<HTMLElement>();
  const [readPosition, setReadPosition] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

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
    postContentRef: pageContentRef,
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

  const { showTipFor, hideTip, tipProps, tipRef, tooltipText } = useTooltip({
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 5,
    placement: 'top',
  });

  const {
    profile,
    profileTipRef,
    profileTipProps,
    showProfileTipFor,
    hideProfileTip,
  } = useAuthor('Valeriy Novytskyy', comments);

  return (
    <MDXProvider
      components={{
        h1: Heading1,
        h2: Heading2,
        h3: Heading3,
        h4: Heading4,
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
      <Main>
        <SEO
          title={seoTitle ?? title}
          description={description}
          image={image?.childImageSharp?.fluid?.src}
          url={relativePostUrl}
        />

        <PageTitle collection={collection}>{title}</PageTitle>

        <Content role="document">
          <Wheel
            offset="2em"
            postUrl={relativePostUrl}
            showCommentsSidebar={showCommentsSidebar}
            commentCount={commentCount}
            reactionCount={reactionCount}
            shareCount={shareCount}
            sharesByType={sharesByType}
            handleSnap={handleSnap}
            handleShare={handleShare}
          />
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
              postContentRef: pageContentRef,
              showProfileTipFor,
              hideProfileTip,
              showTipFor,
              hideTip,
            }}
          >
            {body ? <MDXRenderer>{body}</MDXRenderer> : children}
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
      </Main>

      <Tooltip ref={tipRef} {...tipProps}>
        {tooltipText}
        <Arrow />
      </Tooltip>

      <Tooltip ref={profileTipRef} {...profileTipProps}>
        {profile && <ProfileTip {...profile} />}
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

export default Page;
