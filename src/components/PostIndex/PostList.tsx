/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Component used to render a list of posts.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { PostsQuery } from '../../types/AllPostsQuery';
import { getDateValue, getDateUnits } from '../../utils';
import ClockIcon from '../../images/clock.svg';
import TagList from '../TagList';
import { MOBILE } from '../../constants';

const ARTICLE_THUMBNAIL_WIDTH = 320;
const ARTICLE_THUMBNAIL_HEIGHT = 170;

const Article = styled.article`
  display: flex;
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

const ArticleText = styled.section`
  flex: 1 1;
`;

const ArticleThumbnail = styled.section`
  width: ${ARTICLE_THUMBNAIL_WIDTH}px;
  margin: ${(props) => props.theme.spacing}
    ${(props) => props.theme.spacingHalf};

  @media (max-width: ${MOBILE}) {
    margin-right: 0;
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
        <polygon points="320,170 0,170 0,20.4 20.4,0 320,0 " />
      </clipPath>
    </defs>
    <image
      clipPath="url(#thumbnail-clip)"
      x="0"
      y="0"
      width={`${ARTICLE_THUMBNAIL_WIDTH}px`}
      height={`${ARTICLE_THUMBNAIL_HEIGHT}px`}
      xlinkHref={src}
    />
    <g className="fill-border">
      <polygon points="314,116.4 320,116.4 320,170 266.4,170 266.4,164 314,164 " />
      <polygon points="0,53.6 6,53.6 6,22.9 22.9,6 53.6,6 53.6,0 20.4,0 0,20.4 " />
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

const PostList: FC<PostsQuery> = ({ nodes, group }) => (
  <>
    {nodes.map(
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
          <ArticleText>
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
          </ArticleText>
          <ArticleThumbnail>
            <ArticleImage src={fluid.src} />
          </ArticleThumbnail>
        </Article>
      )
    )}
  </>
);

export default PostList;
