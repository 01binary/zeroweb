import React, { FC } from 'react';
import styled from 'styled-components';
import { PostsQuery } from '../models/AllPostsQuery';
import { getDateValue, getDateUnits } from './Post';
import { Link } from 'gatsby';
import TagList from './TagList';
import ClockIcon from '../images/clock.svg';

const Article = styled.article`
  margin-left: ${props => props.theme.spacingHalf};
  margin-right: ${props => props.theme.spacingHalf};
  padding-bottom: ${props => props.theme.spacingHalf};
  border-bottom: ${props => props.theme.border} dotted ${props => props.theme.borderColor};

  opacity: 0;
  animation: slideIn ${props => props.theme.animationSlow} ${props => .1 * (props.Index + 1)}s ease-out 1;
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
`;

const ArticleLink = styled(Link)`
  margin-top: ${props => props.theme.spacing};

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h2`
  font-size: ${props => props.theme.headingFontSizeLarge};
  font-weight: ${props => props.theme.headingFontWeight};
  margin-left: 0;
  margin-bottom: ${props => props.theme.spacingHalf};
`;

const Meta = styled.section`
  color: ${props => props.theme.secondaryTextColor};
  margin-bottom: ${props => props.theme.spacingHalf};
`;

const MetaIndicator = styled.span`
  color: ${props => props.theme.foregroundColor};
`;

const InlineTags = styled.section`
  margin-bottom: ${props => props.theme.spacing};
`;

const Clock = styled(ClockIcon)`
  position: relative;
  top: 0.2em;
  margin-right: ${props => props.theme.spacingQuarter};
`;

const PostList: FC<PostsQuery> = ({
    nodes
}) => (
    <>
    {nodes.map(({
        slug,
        timeToRead,
        frontmatter: {
          title,
          relativeDate
        },
        fields: {
          tags,
          url
        }
      }, index) => (
        <Article key={slug} Index={index}>
          <Link to={url}>
            <Title>{title}</Title>
          </Link>
          
          <Meta>
            <Clock />
            <MetaIndicator>{getDateValue(relativeDate)} </MetaIndicator>
            {getDateUnits(relativeDate)}
            {timeToRead &&
              <span>
                {' / '}
                <MetaIndicator>{timeToRead}</MetaIndicator> min to read
              </span>
            }
          </Meta>

          <InlineTags>
            <TagList tags={tags} alwaysInline />
          </InlineTags>
          
          <ArticleLink to={url}>
            Read more...
          </ArticleLink>
        </Article>
      ))}
    </>
);

export default PostList;
