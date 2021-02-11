import React, { FunctionComponent } from 'react';
import { Link, graphql } from 'gatsby';
import { ISiteQuery } from '../models/ISiteQuery';
import { IArticlesQuery } from '../models/IArticlesQuery';

interface IIndexQuery {
  site: ISiteQuery,
  allMdx: IArticlesQuery
};

interface IIndexProps {
  data: IIndexQuery
};

const Index = ({
  data: {
    site,
    allMdx
  }
}: IIndexProps) => (
  <div>
    <h1>{site.siteMetadata.title}</h1>
    List of articles
    {allMdx.edges.map(({ node }) => (
      <article>
        <Link to={node.slug}>
          <h2>{node.frontmatter.title}</h2>
          <div>{node.timeToRead} min to read</div>
          <div>{node.frontmatter.tags}</div>
        </Link>
      </article>
    ))}
  </div>
);

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    },
    allMdx {
      edges {
        node {
          frontmatter {
            title,
            date(fromNow:true),
            tags
          }
          slug
          timeToRead
        }
      }
    }
  }
`

export default Index;
