import React, { FC } from 'react';
import { graphql } from 'gatsby';
import PostIndex, { IndexQuery } from '../components/PostIndex';

const Index: FC<IndexQuery> = (props) => (
  <PostIndex {...props} collection="articles"/>
);

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
