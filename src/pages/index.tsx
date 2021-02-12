import React, { FunctionComponent } from 'react';
import { Link, graphql } from 'gatsby';
import IArticlesQuery from '../models/IArticlesQuery';

interface IIndexProps {
  data: IArticlesQuery
};

const Index: FunctionComponent<IIndexProps> = ({
  data: { allMdx: { nodes } }
}) => (
  <main>
    <h1>Articles</h1>

    {nodes.map(({
      slug,
      timeToRead,
      frontmatter: {
        title,
        tags
      }
    }) => (
      <article key={slug}>
        <Link to={`articles/${slug}`}>
          <h2>{title}</h2>
          <section>{timeToRead} min to read</section>
          <section>{tags}</section>
        </Link>
      </article>
    ))}
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
          date(fromNow:true),
          tags
        }
      }
    }
  }
`

export default Index;
