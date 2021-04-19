import React, { FC, useContext } from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import Title from '../components/Title';
import BlogContext from '../components/BlogContext';
import PostList from '../components/PostList';
import { AllPostsQuery } from '../models/AllPostsQuery';
import { getTagFilter, getTagDescriptionById } from '../components/TagList';

const Filter = styled.p`
  text-transform: lowercase;
  animation: slideIn ${props => props.theme.animationSlow} ease-out 1;

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

interface IndexProps {
  data: AllPostsQuery;
};

const Index: FC<IndexProps> = ({
  data: {
    allMdx: {
      nodes,
      group
    }
  }
}) => {
  const { url } = useContext(BlogContext);
  const tagId = getTagFilter(url);
  const tagDescription = getTagDescriptionById(tagId);

  return (
    <main>
      <Title collection={"articles"}>
        Articles
      </Title>
      {tagId &&
        <Filter>All <b>{tagDescription}</b> articles:</Filter>
      }
      <PostList nodes={nodes} group={group} />
    </main>
  );
};

export const query = graphql`
  query($tag: String) {
    allMdx
    (
      sort: { fields: [frontmatter___date], order: DESC },
      filter: {
        fields: {
          collection: { eq: "articles" },
          tags: { eq: $tag }
        }
      }
    ) {
      nodes {
        slug
        timeToRead
        frontmatter {
          title,
          relativeDate: date(fromNow: true)
          date(formatString: "MMMM DD, YYYY")
        }
        fields {
          url,
          collection
          tags
        }
      }
      group(field: frontmatter___tags) {
        tag: fieldValue
        totalCount
      }
    }
  }
`

export default Index;
