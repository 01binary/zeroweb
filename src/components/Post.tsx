/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Post template (post details when clicking on a post).
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { useState, FC, useMemo } from "react"
import styled from 'styled-components';
import Img from "gatsby-image";
import { graphql } from "gatsby";
import { useBlogContext } from '../hooks/useBlogContext';
import {
  CommentsContext,
  useComments
} from '../hooks/useComments';
import { MDXRenderer } from "gatsby-plugin-mdx";
import { getHeadingSlug, getHeadingUrl } from './Heading';
import PostQuery from '../types/PostQuery';
import HeadingQuery from '../types/HeadingQuery';
import useScrollPosition from '../hooks/useScrollPosition';
import useApiClient from '../hooks/useApiClient';
import GaugeIcon from '../images/gauge.svg';
import ClockIcon from '../images/clock.svg';
import { Heading } from './Heading';
import Wheel, { WHEEL_SIZE } from './Wheel';
import { Ruler, RULER_OFFSET, RULER_SELECTION_GUTTER } from './Ruler';
import TagList from './TagList';
import SEO from './SEO';
import TOC from './TOC';
import Comments from './Comments/Comments';
import MetaLink from './MetaLink';
import { useLogin } from "../hooks/useLogin";

const Main = styled.main`
  margin-bottom: 3em;

  &:after {
    top: 0;
  }

  text-rendering: optimizeLegibility;

  h1 {
    padding-right: calc(20% + ${props => props.theme.spacing});
    margin-left: ${props => props.theme.spacingHalf};
    margin-right: ${props => props.theme.spacingHalf};
  }

  h2 {
    font-size: ${props => props.theme.headingFontSizeMedium};
  }

  h3 {
    font-size: ${props => props.theme.headingFontSizeSmall};
  }

  h4 {
    font-size: ${props => props.theme.headingFontSizeSmaller};
  }

  h2, h3, h4 {
    text-transform: lowercase;
    font-family: ${props => props.theme.headingFont};
    font-weight: ${props => props.theme.headingFontWeight};
    margin-bottom: ${props => props.theme.margin};
    margin-top: ${props => props.theme.margin};
    clear: left;
  }

  h1, h2, h3, h4 {
    &:after {
      content: '';
      position: absolute;
      left: calc(100% + ${props => props.theme.spacingHalf} + ${props => props.theme.border} + ${RULER_OFFSET}px);
      top: 0;
      width: calc(${props => props.theme.border} * 1.5);
      height: 100%;
      background: ${props => props.theme.foregroundColor};
      opacity: .4;
      transition: opacity ${props => props.theme.animationFast} ease-out;
    }
  }

  h1:after {
    left: calc(100% + ${props => props.theme.spacing} + ${props => props.theme.border} + ${RULER_SELECTION_GUTTER}px);
  }

  h1:hover,
  h2:hover,
  h3:hover,
  h4:hover {
    &:after {
      opacity: 1;
    }

    a {
      opacity: 1;
    }
  }

  ol {
    position: relative;
    list-style: none;
    counter-reset: listCounter;
    padding-left: ${props => props.theme.spacingHalf};

    &:after {
      content: '';
      position: absolute;
      left: calc(100% + ${props => props.theme.spacingHalf} + ${props => props.theme.border} + ${RULER_OFFSET}px);
      top: 0;
      width: calc(${props => props.theme.border} * 1.5);
      height: 100%;
      background: ${props => props.theme.foregroundColor};
      opacity: .4;
      transition: opacity ${props => props.theme.animationFast} ease-out;
    }

    &:hover {
      &:after {
        opacity: 1;
      }
    }
  }

  ol > li {
    margin: 0 0 ${props => props.theme.spacingHalf} 0;
    &:before {
      display: inline-block;
      content: counter(listCounter);
      color: ${props => props.theme.foregroundColor};
      counter-increment: listCounter;
      line-height: ${props => props.theme.spacingOneAndThird};
      background: ${props => props.theme.isDark
        ? props.theme.accentDarkShadowColor
        : props.theme.accentLightShadowColor};
      width: ${props => props.theme.spacingOneAndThird};
      height: ${props => props.theme.spacingOneAndThird};
      border-radius: ${props => props.theme.spacingOneAndThird};
      margin: 0 ${props => props.theme.spacingHalf} 0 0;
      text-align: center;
      transition:
        color .3s ease-in-out,
        background-color .3s ease-in-out;
    }

    &:hover:before,
    &:focus:before {
      color: ${props => props.theme.backgroundColor};
      background: ${props => props.theme.isDark
        ? props.theme.accentColor
        : props.theme.accentShadowColor
      };
    }
  }

  @media(max-width: ${props => props.theme.mobile}) {
    h1, h2, h3, h4 {
      max-width: initial;
      margin-left: ${props => props.theme.spacingHalf};
      margin-right: ${props => props.theme.spacingHalf};
      padding-right: 0;

      &:after {
        display: none;
      }
    }

    ul, ol {
      &:after {
        display: none;
      }
    }
  }
`;

const HeroImage = styled(Img)`
  overflow: initial !important;
  max-width: calc(80% - 3em);
  margin-right: 1.5em;
  margin-left: ${props => props.theme.spacingHalf};
  z-index: -1;

  &:after {
    content: '';
    position: absolute;
    left: calc(100% + ${props => props.theme.spacingHalf} + ${RULER_OFFSET}px + 7px);
    top: 0;
    width: calc(${props => props.theme.border} * 1.5);
    height: 100%;
    background: ${props => props.theme.foregroundColor};
    opacity: .4;
    transition: opacity ${props => props.theme.animationFast} ease-out;
  }

  opacity: 0;
  animation: slideIn ${props => props.theme.animationSlow} .2s ease-out 1;
  animation-fill-mode: forwards;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px)
    }

    100% {
      opacity: 1;
      transform: translateY(0px)
    }
  }

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: 100%;
    margin-top: 1em;
    margin-right: ${props => props.theme.spacingHalf};

    &:after {
      display: none;
    }
  }
`;

const Metadata = styled.section`
  display: flex;

  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  color: ${props => props.theme.secondaryTextColor};
  max-width: calc(80% - 3em);
  margin-left: 1em;
  margin-bottom: 1.5em;

  opacity: 0;
  animation: slideIn ${props => props.theme.animationSlow} .1s ease-out 1;
  animation-fill-mode: forwards;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px)
    }

    100% {
      opacity: 1;
      transform: translateY(0px)
    }
  }

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: 100%;
    margin-bottom: 0;
  }
`;

const Content = styled.section`
  max-width: calc(80% - 2em);

  opacity: 0;
  animation: slideIn ${props => props.theme.animationSlow} .2s ease-out 1;
  animation-fill-mode: forwards;
  
  ul {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: calc(100% + ${props => props.theme.spacingHalf} + ${props => props.theme.border} + ${RULER_OFFSET}px);
      top: 0;
      width: calc(${props => props.theme.border} * 1.5);
      height: 100%;
      background: ${props => props.theme.foregroundColor};
      opacity: .4;
      transition: opacity ${props => props.theme.animationFast} ease-out;
    }

    &:hover {
      &:after {
        opacity: 1;
      }
    }
  }

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px)
    }

    100% {
      opacity: 1;
      transform: translateY(0px)
    }
  }

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: 100%;
  }
`;

const Wheelhouse = styled.section`
  opacity: 1;
  position: sticky;
  float: left;
  top: ${props => props.theme.spacingHalf};
  width: ${WHEEL_SIZE};
  height: ${WHEEL_SIZE};
  margin-left: -${props => props.theme.unit + WHEEL_SIZE}px;

  opacity: 1;
  animation: slideIn ${props => props.theme.animationSlow} ease-out 1;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px)
    }

    100% {
      opacity: 1;
      transform: translateY(0px)
    }
  }

  transform: translateY(0);
  transition:
    opacity ${props => props.theme.animationFast} ease-out,
    transform ${props => props.theme.animationSlow} ease-out;

  @media(max-width: ${props => props.theme.wide}) {
    opacity: 0;
    transform: translateY(1.5em);
  }

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const SidebarPanel = styled.section`
  display: block;

  @media(max-width: ${props => props.theme.mobile}) {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  float: right;
  top: 0;
  left: 100%;
  min-width: 20%;
  max-width: 20%;
  margin-top: -5.25em;
  padding-top: ${props => props.theme.spacingThird};

  @media(max-width: ${props => props.theme.mobile}) {
    position: relative;
    float: none;
    left: 0;
    max-width: 100%;
    padding-top: 0;
    margin-top: 1em;
    margin-left: ${props => props.theme.spacingHalf};
    margin-right: ${props => props.theme.spacingHalf};
  }
`;

const SidebarMetadata = styled.div`
  position: relative;
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  color: ${props => props.theme.secondaryTextColor};
  margin-bottom: ${props => props.theme.spacing};

  opacity: 0;
  animation: slideIn ${props => props.theme.animationSlow} .1s ease-out 1;
  animation-fill-mode: forwards;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px)
    }

    100% {
      opacity: 1;
      transform: translateY(0px)
    }
  }

  @media(max-width: ${props => props.theme.mobile}) {
    flex: 0 1 auto;
    margin-left: 1em;

    &:after {
      content: '';
      position: absolute;
      left: -2.5em;
      top: -1em;
      bottom: -1em;
      width: 2.5em;
      transition: background-color ${props => props.theme.animationFast} ease-out;
      background: linear-gradient(
        90deg,
        ${props => props.theme.backgroundColor + '00'} 0%,
        ${props => props.theme.backgroundColor} 50%
      );
      
      z-index: 1;
    }
  }
`;

const Gauge = styled(GaugeIcon)`
  float: left;
  margin: .25em .25em 0 .5em;

  #arrow {
    transform: rotate(${props => props.position * 90}deg);
    transform-origin: 45.634px 47.543px;
    transition: transform ${props => props.theme.animationFast} ease-in-out;
  }

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const Indicator = styled.span`
  font-size: 20pt;
  color: ${props => props.theme.foregroundColor};

  @media(max-width: ${props => props.theme.mobile}) {
    font-size: ${props => props.theme.smallFontSize};
  }
`;

const InlineIndicator = styled.span`
  color: ${props => props.theme.foregroundColor};
`;

const IndicatorLabel = styled.div`
  @media(max-width: ${props => props.theme.mobile}) {
    display: inline;
  }
`;

const Clock = styled(ClockIcon)`
  margin-top: -1px;
  margin-right: ${props => props.theme.spacingQuarter};
`;

const PostHeading = styled(Heading)`
  animation: slideIn ${props => props.theme.animationSlow} ease-out 1;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px)
    }

    100% {
      opacity: 1;
      transform: translateY(0px)
    }
  }
`;

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

const Location = styled.span`
  @media(max-width: 540px) {
    display: none;
  }
`;

const Author = styled.span`
  @media(max-width: 380px) {
    display: none;
  }
`;

interface SlugifiedHeading extends HeadingQuery {
  slug: string,
  url: string
};

const slugifyHeadings = (
  baseUrl: string,
  headings: HeadingQuery[]
): SlugifiedHeading[] => headings.map((heading) => {
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

interface PostProps {
  data: PostQuery
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
  const { credentials } = useBlogContext();
  const client = useApiClient(credentials);
  const {
    handleFacebookLogin,
    handleGoogleLogin,
    handleTwitterLogin,
    handleLogout,
    loginError,
  } = useLogin();
  const {
    comments,
    loading,
    error,
    commentError,
    handleVote,
    handleAdd,
    handleEdit,
    handleDelete,
    handleReact,
  } = useComments(slug, client);
  const [ readPosition, setReadPosition ] = useState<number>(0);
  const [ scrollOffset, setScrollOffset ] = useState<number>(0);

  useScrollPosition((position, offset) => {
    setReadPosition(position);
    setScrollOffset(offset);
  }, [readPosition]);

  return (
    <>
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
        </Metadata>

        <Wheelhouse>
          <Wheel comments={comments} />
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
        commentError={commentError}
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
    </>
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
