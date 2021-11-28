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

import React, { useState, FC, useCallback } from "react";
import { MDXProvider } from '@mdx-js/react';
import { graphql } from "gatsby";
import { useBlogContext } from '../../hooks/useBlogContext';
import { CommentsContext } from '../../hooks/useComments';
import { MDXRenderer } from "gatsby-plugin-mdx";
import { getHeadingSlug, getHeadingUrl } from '../Heading';
import PostQuery from '../../types/PostQuery';
import HeadingQuery from '../../types/HeadingQuery';
import useScrollPosition from '../../hooks/useScrollPosition';
import Wheel from '../Wheel';
import { Ruler } from '../Ruler';
import TagList from '../TagList';
import SEO from '../SEO';
import TOC from '../TOC';
import MetaLink from '../MetaLink';
import Comments from '../Comments/Comments';
import Code from '../Code';
import Paragraph from '../Paragraph';
import Blockquote from '../Blockquote';
import { Main, PostHeading, Metadata, Clock, InlineIndicator, IndicatorLabel, Author, Location, InlineTimeToRead, Indicator, Wheelhouse, Sidebar, SidebarPanel, SidebarMetadata, Gauge, HeroImage, Content } from './Post.styles';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4
} from '../Heading';
import {
  Table,
  TableHeading,
  TableRow,
  TableCell
} from '../Table';
import { useLogin } from "../../hooks/useLogin";
import useUserContent from "../../hooks/useUserContent";

const AuthorLink = () => (
  <MetaLink to="/about">
    Valeriy Novytskyy
  </MetaLink>
);

const LocationLink = () => (
  <MetaLink to="#">
    Portland, OR
  </MetaLink>
);

const slugifyHeadings = (
  baseUrl: string,
  headings: HeadingQuery[]
) => headings.map((heading) => {
  const slug = getHeadingSlug(false, heading.value);
  return {
    ...heading,
    url: getHeadingUrl(baseUrl, slug),
    slug
  };
});

export const getDateValue = (relativeDate: string): string => (
  relativeDate.split(' ')[0]
);

export const getDateUnits = (relativeDate: string): string => (
  relativeDate.split(' ').slice(1).join(' ')
);

const openUrl = (url, params) => {
  const href = new URL(url);
  href.search = new URLSearchParams(params).toString();
  window.open(href.toString());
};

type PostProps = {
  data: PostQuery;
};

const Post: FC<PostProps> = ({
  data: {
    mdx: {
      slug,
      body,
      timeToRead,
      frontmatter: {
        title,
        description,
        image: {
          childImageSharp: { fluid }
        },
        relativeDate
      },
      fields: {
        url,
        collection,
        tags
      },
      headings
    },
    allMdx: {
      group
    }
  }
}) => {
  const [ readPosition, setReadPosition ] = useState(0);
  const [ scrollOffset, setScrollOffset ] = useState(0);

  useScrollPosition((position, offset) => {
    setReadPosition(position);
    setScrollOffset(offset);
  }, [readPosition]);

  const { user } = useBlogContext();

  const {
    handleFacebookLogin,
    handleGoogleLogin,
    handleTwitterLogin,
    handleLogout,
    loginError,
  } = useLogin();

  const {
    loading,
    error,
    comments,
    handleAdd,
    handleEdit,
    handleDelete,
    handleVote,
    handleReact,
    shareCount,
    sharesByType,
    handleAddShare,
  } = useUserContent(slug);

  const handleSnap = useCallback(() => {
    handleReact({
      userName: user?.name || '',
      avatarUrl: user?.avatarUrl || '',
      parentTimestamp: null,
      reaction: 'snap'
    });
  }, [user, handleReact]);

  const handleShare = useCallback((shareType) => {
    switch (shareType) {
      case 'linkShare':
        handleAddShare('link');
        navigator.clipboard.writeText(window.location.href);
        break;
      case 'facebookShare':
        handleAddShare('facebook');
        openUrl('https://www.facebook.com/sharer.php', {
          u: window.location.href
        });
        break;
      case 'twitterShare':
        handleAddShare('twitter');
        openUrl('https://twitter.com/intent/tweet', {
          text: title,
          url: window.location.href,
        });
        break;
      case 'linkedInShare':
        handleAddShare('linkedIn');
        openUrl('https://www.linkedin.com/shareArticle', {
          title,
          url: window.location.href,
          summary: description,
          mini: true,
        });
        break;
      case 'emailShare':
        handleAddShare('email');
        window.open(`mailto:?subject=${title}&body=${window.location.href}`);
        break;
    }
  }, [handleAddShare]);

  return (
    <MDXProvider components={{
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
    }}>
      <Main>
        <SEO
          title={title}
          description={description}
          image={fluid.src}
          url={url}
        />

        <Ruler />

        <PostHeading>{title}</PostHeading>

        <Metadata>
          <Clock />
          <InlineIndicator>{getDateValue(relativeDate)}</InlineIndicator>
          &nbsp;
          <IndicatorLabel>{getDateUnits(relativeDate)}</IndicatorLabel>
          &nbsp;
          <Author> by <AuthorLink /></Author>
          &nbsp;
          <Location> in <LocationLink /></Location>
          <InlineTimeToRead>
            /
            &nbsp;
            <Indicator>{timeToRead}</Indicator><span> min </span>
            <IndicatorLabel>to read</IndicatorLabel>
          </InlineTimeToRead>
        </Metadata>

        <Wheelhouse>
          <Wheel
            comments={comments}
            shareCount={shareCount}
            sharesByType={sharesByType}
            handleSnap={handleSnap}
            handleShare={handleShare}
          />
        </Wheelhouse>

        <Sidebar>
          <SidebarPanel>
            <SidebarMetadata>
              <Gauge position={readPosition} />
              <Indicator>{timeToRead}</Indicator><span> min </span>
              <IndicatorLabel>to read</IndicatorLabel>
            </SidebarMetadata>
            <TagList tags={tags} stats={group} collection={collection} />
            <TagList tags={tags} stats={group} collection={collection} inline />
          </SidebarPanel>

          <TOC headings={slugifyHeadings(url, headings)} />
        </Sidebar>

        <HeroImage fluid={fluid} />

        <Content role="document">
          <CommentsContext.Provider value={{ comments }}>
            <MDXRenderer>
              {body}
            </MDXRenderer>
          </CommentsContext.Provider>
        </Content>
      </Main>

      <Comments
        slug={slug}
        loading={loading}
        error={error}
        loginError={loginError}
        comments={comments}
        handleVote={handleVote}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleReact={handleReact}
        handleFacebookLogin={handleFacebookLogin}
        handleTwitterLogin={handleTwitterLogin}
        handleGoogleLogin={handleGoogleLogin}
        handleLogout={handleLogout}
        readPosition={readPosition}
        scrollOffset={scrollOffset}
      />
    </MDXProvider>
  );
};

export const pageQuery = graphql`
  query($slug: String!, $collection: String!) {
    mdx(slug: { eq: $slug }) {
      slug
      body
      timeToRead
      frontmatter {
        title
        description
        image {
          childImageSharp {
            fluid(maxWidth:768, maxHeight:280) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        relativeDate: date(fromNow: true)
        date(formatString: "MMM DD, YYYY")
        tags
      }
      fields {
        url,
        collection,
        tags
      }
      headings {
        value
        depth
      }
    }
    allMdx(filter: {fields: {collection: {eq: $collection}}}) {
      group(field: frontmatter___tags) {
        tag: fieldValue
        totalCount
      }
    }
  }
`

export default Post;
