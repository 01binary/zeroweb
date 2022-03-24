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
import TagList from '../../components/TagList';
import ClockIcon from '../../images/clock.svg';

const Article = styled.article`
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
          frontmatter: { title, relativeDate },
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
              <MetaIndicator>{getDateValue(relativeDate)}&nbsp;</MetaIndicator>
            )}
            {getDateUnits(relativeDate)}
            {timeToRead && (
              <span>
                {' / '}
                <MetaIndicator>{timeToRead}</MetaIndicator> min to read
              </span>
            )}
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
