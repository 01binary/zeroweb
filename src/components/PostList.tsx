import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { IPosts } from '../models/IAllPosts';

const Article = styled.article`
  border-bottom: ${props => props.theme.border} dotted ${props => props.theme.shadowLightColor};
`;

const Title = styled.h2`
  font-size: ${props => props.theme.headingFontSizeMedium};
`;

const Meta = styled.section``;

const InlineTags = styled.section``;

const PostList: FunctionComponent<IPosts> = ({
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
          <Link to={url}>
            <Title>{title}</Title>
            <Meta>{date}</Meta>
            {timeToRead && <Meta>{timeToRead} min to read</Meta>}
            <InlineTags>{tags}</InlineTags>
          </Link>
        </Article>
      ))}
    </>
);

export default PostList;
