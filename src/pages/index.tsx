import React, { FC } from 'react';
import { graphql } from 'gatsby';
import Title from '../components/Title';
import PostList from '../components/PostList';
import { AllPostsQuery } from '../models/AllPostsQuery';

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
}) => (
  <main>
    <Title collection={"articles"}>
      Articles
    </Title>
    <PostList nodes={nodes} group={group} />
  </main>
);

export const query = graphql`
  query {
    allMdx
    (
      sort: { fields: [frontmatter___date], order: DESC },
      filter: { fields: { collection: { eq: "articles" } } }
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
