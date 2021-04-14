import React, { FC } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import TagList from './TagList';
import { PostsQuery } from '../models/AllPostsQuery';

const Article = styled.article`
  margin-left: ${props => props.theme.spacingHalf};
  padding-bottom: ${props => props.theme.spacingHalf};
  border-bottom: ${props => props.theme.border} dotted ${props => props.theme.shadowLightColor};

  &:first-of-type {
    padding-top: 0;
  }

  padding-top: ${props => props.theme.spacingHalf};
`;

const ArticleLink = styled(Link)`
  margin-top: ${props => props.theme.spacing};

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h2`
  font-size: ${props => props.theme.headingFontSizeMedium};
  margin-left: 0;
`;

const Meta = styled.section`
  margin-bottom: ${props => props.theme.spacingHalf};
`;

const InlineTags = styled.section`
  margin-bottom: ${props => props.theme.spacingHalf};
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
          date
        },
        fields: {
          tags,
          url
        }
      }) => (
        <Article key={slug}>
          <Meta>{date}</Meta>

          <Link to={url}>
            <Title>{title}</Title>
          </Link>
          
          {timeToRead && <Meta>{timeToRead} min to read</Meta>}

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
