import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import Title from '../components/Title';
import PostList from '../components/PostList';
import { IAllPosts } from '../models/IAllPosts';

interface IProjectsProps {
  data: IAllPosts
};

const Index: FunctionComponent<IProjectsProps> = ({
  data: { allMdx: { nodes } }
}) => (
  <main>
    <Title offset={2}>Projects</Title>
    <PostList nodes={nodes} />
  </main>
);

export const query = graphql`
  query {
    allMdx
    (
      sort: { fields: [frontmatter___date], order: DESC },
      filter: { fields: { collection: { eq: "projects" } } }
    ) {
      nodes {
        slug
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
