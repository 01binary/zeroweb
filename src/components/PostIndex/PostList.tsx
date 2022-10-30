/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Component used to render a list of posts.
|----------------------------------------------------------
|  Copyright(C) 2022 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { PostsQuery } from '../../types/AllPostsQuery';
import { getDateValue, getDateUnits } from '../../utils';
import ClockIcon from '../../images/clock.svg';
import TagList from '../TagList';
import { MOBILE } from '../../constants';
import PostDetailsQuery from '../../types/PostQuery';

const ARTICLE_THUMBNAIL_WIDTH = 320;
const ARTICLE_THUMBNAIL_HEIGHT = 170;

const Article = styled.article`
  position: relative;
  margin-top: ${(props) => props.theme.spacingHalf};
  margin-left: ${(props) => props.theme.spacingHalf};
  margin-right: ${(props) => props.theme.spacingHalf};
  padding-bottom: ${(props) => props.theme.spacingHalf};
  border-bottom: ${(props) => props.theme.border} dotted
    ${(props) => props.theme.borderColor};

  opacity: 0;
  animation: slideIn ${(props) => props.theme.animationSlow}
    ${(props) => 0.12 * (props.Index + 1)}s ease-out 1;
  animation-fill-mode: forwards;

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

const ArticleThumbnail = styled.section`
  width: ${ARTICLE_THUMBNAIL_WIDTH}px;
  margin: ${(props) => props.theme.spacing}
    ${(props) => props.theme.spacingHalf};

  .thumbnail__border {
    fill: ${(props) => props.theme.accentShadowColor};
    opacity: 0.5;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
  }

  .thumbnail__hover {
    opacity: 0;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
  }

  &:hover {
    .thumbnail__border {
      opacity: 1;
    }

    .thumbnail__hover {
      opacity: 0.15;
    }
  }

  @media (max-width: ${MOBILE}) {
    margin-left: 0;
    margin-right: 0;
  }
`;

const ArticleThumbnailLink = styled(Link)`
  position: absolute;
  right: 0;
  top: 0;

  @media (max-width: ${MOBILE}) {
    position: initial;
    right: initial;
    top: initial;

    &:focus {
      border-radius: ${(props) => props.theme.borderRadius};
      box-shadow: none;
      outline: initial;
    }
  }
`;

const ArticleImage = ({ src }) => (
  <svg
    width={ARTICLE_THUMBNAIL_WIDTH}
    height={ARTICLE_THUMBNAIL_HEIGHT}
    viewBox={`0 0 ${ARTICLE_THUMBNAIL_WIDTH} ${ARTICLE_THUMBNAIL_HEIGHT}`}
  >
    <defs>
      <clipPath id="thumbnail-clip">
        <polygon points="299.6,170 0,170 0,20.4 20.4,0 320,0 320,149.6" />
      </clipPath>
      <linearGradient
        id="thumbnail-gradient"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="112"
        y2="130"
      >
        <stop offset="0" stopColor="#40A7F0" />
        <stop offset="0.1171" stopColor="#788BED" />
        <stop offset="0.2466" stopColor="#AE6FE9" />
        <stop offset="0.3585" stopColor="#D65AE7" />
        <stop offset="0.447" stopColor="#EF4EE6" />
        <stop offset="0.6011" stopColor="#F849E5" />
        <stop offset="0.8" stopColor="#F94CD2" />
        <stop offset="0.9095" stopColor="#FF5D71" />
        <stop offset="1" stopColor="#FF5E6D" />
      </linearGradient>
    </defs>
    <image
      clipPath="url(#thumbnail-clip)"
      x="0"
      y="0"
      width={`${ARTICLE_THUMBNAIL_WIDTH}px`}
      height={`${ARTICLE_THUMBNAIL_HEIGHT}px`}
      xlinkHref={src}
    />
    <rect
      className="thumbnail__hover"
      clipPath="url(#thumbnail-clip)"
      fill="url(#thumbnail-gradient)"
      style={{ mixBlendMode: 'overlay' }}
      width={ARTICLE_THUMBNAIL_WIDTH}
      height={ARTICLE_THUMBNAIL_HEIGHT}
    />
    <g className="thumbnail__border">
      <polygon points="320,116.4 314,116.4 314,147.1 297.1,164 266.4,164 266.4,170 299.6,170 320,149.6" />
      <polygon points="0,53.6 6,53.6 6,22.9 22.9,6 53.6,6 53.6,0 20.4,0 0,20.4" />
    </g>
  </svg>
);

const ArticleLink = styled(Link)`
  margin-top: ${(props) => props.theme.spacing};

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h2`
  font-size: ${(props) => props.theme.headingFontSizeLarge};
  font-weight: ${(props) => props.theme.headingFontWeight};
  margin-left: 0;
  margin-bottom: ${(props) => props.theme.spacingHalf};
  margin-block-start: 0;
  max-width: calc(
    100% - ${ARTICLE_THUMBNAIL_WIDTH}px - ${(props) => props.theme.spacing}
  );

  @media (max-width: ${MOBILE}) {
    max-width: initial;
  }
`;

const ArticleSummary = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 15pt;
  font-weight: 300;
  font-style: italic;
  color: ${(props) => props.theme.secondaryTextColor};
  margin-left: 0;
`;

const Meta = styled.section`
  color: ${(props) => props.theme.secondaryTextColor};
  margin-bottom: ${(props) => props.theme.spacingHalf};
  max-width: calc(
    100% - ${ARTICLE_THUMBNAIL_WIDTH}px - ${(props) => props.theme.spacing}
  );

  @media (max-width: ${MOBILE}) {
    max-width: initial;
  }
`;

const MetaIndicator = styled.span`
  color: ${(props) => props.theme.foregroundColor};
`;

const InlineTags = styled.section`
  margin-bottom: ${(props) => props.theme.spacing};
`;

const Clock = styled(ClockIcon)`
  position: relative;
  top: 0.2em;
  margin-right: ${(props) => props.theme.spacingQuarter};
`;

const ArticleTitleLink = styled(Link)`
  &:focus {
    outline: none;
    box-shadow: initial;
    border-radius: initial;
  }

  h2 {
    position: relative;
  }

  &:focus h2:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 0 ${(props) => props.theme.border}
      ${(props) => props.theme.focusColor};
    border-radius: ${(props) => props.theme.borderRadius};
  }
`;

const pinnedFirst = (
  {
    frontmatter: { pinned: firstPinned, date: firstFormattedDate },
  }: PostDetailsQuery,
  {
    frontmatter: { pinned: secondPinned, date: secondFormattedDate },
  }: PostDetailsQuery
) => {
  const firstDate = new Date(firstFormattedDate);
  const firstOrder = firstPinned ? 1 : 0;
  const secondDate = new Date(secondFormattedDate);
  const secondOrder = secondPinned ? 1 : 0;

  if (firstOrder > secondOrder) return -1;
  if (secondOrder > firstOrder) return 1;

  if (firstDate > secondDate) return -1;
  if (secondDate > firstDate) return 1;

  return 0;
};

const PostList: FC<PostsQuery> = ({ nodes, group }) => (
  <>
    {nodes
      .sort(pinnedFirst)
      .map(
        (
          {
            slug,
            timeToRead,
            frontmatter: {
              title,
              relativeDate,
              description,
              image: {
                childImageSharp: { fluid },
              },
            },
            fields: { tags, collection, url },
          },
          index
        ) => (
          <Article key={slug} Index={index}>
            <ArticleTitleLink to={url}>
              <Title>{title}</Title>
            </ArticleTitleLink>

            <Meta>
              <Clock />
              {Boolean(getDateValue(relativeDate).length) && (
                <MetaIndicator>
                  {getDateValue(relativeDate)}&nbsp;
                </MetaIndicator>
              )}
              {getDateUnits(relativeDate)}
              {timeToRead && (
                <span>
                  {' / '}
                  <MetaIndicator>{timeToRead}</MetaIndicator> min to read
                </span>
              )}
              <ArticleThumbnailLink to={url}>
                <ArticleThumbnail>
                  <ArticleImage src={fluid.src} />
                </ArticleThumbnail>
              </ArticleThumbnailLink>

              <ArticleSummary>{description}</ArticleSummary>
            </Meta>

            <InlineTags>
              <TagList
                tags={tags}
                stats={group}
                collection={collection}
                alwaysInline
              />
            </InlineTags>

            <ArticleLink to={url}>Read more...</ArticleLink>
          </Article>
        )
      )}
  </>
);

export default PostList;
