import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import PostList from '../components/PostList';
import { IAllPosts } from '../models/IAllPosts';

interface IIndexProps {
  data: IAllPosts
};

const Index: FunctionComponent<IIndexProps> = ({
  data: { allMdx: { nodes } }
}) => (
  <main>
    <h1>Articles</h1>

    <PostList nodes={nodes} />
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
          date(fromNow:true)
        }
        fields {
          url,
          tags
        }
      }
    }
  }
`

export default Index;
