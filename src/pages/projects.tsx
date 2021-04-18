import React, { FC } from 'react';
import { graphql } from 'gatsby';
import Title from '../components/Title';
import PostList from '../components/PostList';
import { AllPostsQuery } from '../models/AllPostsQuery';

interface ProjectsProps {
  data: AllPostsQuery;
};

const Index: FC<ProjectsProps> = ({
  data: {
    allMdx: {
      nodes,
      group
    }
  }
}) => (
  <main>
    <Title collection={"projects"}>
      Projects
    </Title>
    <PostList nodes={nodes} group={group} />
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
          relativeDate: date(fromNow: true)
          date(formatString: "MMMM DD, YYYY")
        }
        fields {
          url,
          collection,
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
