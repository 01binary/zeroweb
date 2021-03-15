import React, { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { ThemeContext } from './ThemeContext';
import { IPosts } from '../models/IAllPosts';

const Article = styled.article`
    padding-left: 16px;
    padding-bottom: ${props => props.theme.spacingHalf};
    border-bottom: ${props => props.theme.border} dotted ${props => props.theme.shadowLightColor};

    &:first {
      padding-top: 0;
    }

    padding-top: ${props => props.theme.spacingHalf};
`;

const ArticleLink = styled(Link)`
    color: ${props => props.theme.foregroundColor};
`;

const Title = styled.h2`
    font-size: ${props => props.theme.headingFontSizeMedium};
`;

const Meta = styled.section``;

const InlineTags = styled.section``;

const PostList: FunctionComponent<IPosts> = ({
    nodes
}) => {
  const { theme } = useContext(ThemeContext);
  return (
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
          <Article key={slug} theme={theme}>
            <Meta theme={theme}>{date}</Meta>

            <ArticleLink to={url} theme={theme}>
              <Title>{title}</Title>
            </ArticleLink>
            
            {timeToRead && <Meta>{timeToRead} min to read</Meta>}

            <InlineTags theme={theme}>{tags}</InlineTags>
            
            <ArticleLink to={url} theme={theme}>
              Read more...
            </ArticleLink>
          </Article>
        ))}
      </>
  );
};

export default PostList;
