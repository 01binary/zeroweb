import React, { FC, useRef } from 'react';
import { graphql } from 'gatsby';
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

const PageTitle = styled(Title)`
  margin-bottom: calc(0px - ${(props) => props.theme.spacingHalf});
`;

const Paragraph = styled.p`
  margin-left: calc(${(props) => props.theme.spacing} * 5);

  @media (max-width: ${MOBILE}) {
    max-width: 100%;
    margin-left: ${(props) => props.theme.spacingHalf};
  }
`;

const Main = styled.main`
  margin-bottom: calc(${(props) => props.theme.spacing} * 5);

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

  .hero {
    font-family: 'Roboto', sans-serif;
    font-size: 18pt;
    font-weight: 400;
    margin-block-start: 0;
  }

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

type PageQuery = {
  data: {
    page: {
      slug: string;
      body: string;
      frontmatter: {
        title: string;
        description: string;
        image: {
          childImageSharp: {
            fluid: {
              base64: string;
              aspectRatio: number;
              src: string;
              srcSet: string;
              sizes: string;
            };
          };
        };
        collection: string;
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
  data: {
    site: {
      siteMetadata: { url: siteUrl },
    },
    page: {
      slug,
      body,
      frontmatter: {
        title,
        description,
        image: {
          childImageSharp: { fluid },
        },
        collection,
      },
      fields: { url: relativePostUrl },
    },
  },
}) => {
  const pageContentRef = useRef<HTMLElement>();

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

  const absolutePostUrl = siteUrl + relativePostUrl;

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
          title={title}
          description={description}
          image={fluid.src}
          url={relativePostUrl}
        />

        <PageTitle collection={collection}>{title}</PageTitle>

        <Content role="document">
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
            <MDXRenderer>{body}</MDXRenderer>
          </CommentsContext.Provider>
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
    </MDXProvider>
  );
};

export default Page;

export const pageQuery = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        url
      }
    }
    page: mdx(slug: { eq: $slug }) {
      slug
      body
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
        collection
      }
      fields {
        url
      }
    }
  }
`;
