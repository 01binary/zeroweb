import React, { FC } from 'react';
import { graphql } from 'gatsby';
import PostIndex, { IndexQuery } from '../components/PostIndex';

const Index: FC<IndexQuery> = (props) => (
  <PostIndex {...props} collection="projects"/>
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
