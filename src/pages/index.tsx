import React, { FunctionComponent } from 'react';
import { Link, graphql } from 'gatsby';
import IArticleIndexQuery from '../models/IArticleIndexQuery';

interface IIndexProps {
  data: IArticleIndexQuery
};

const Index: FunctionComponent<IIndexProps> = ({
  data: {
    allMdx: {
      nodes
    }
  }
}) => (
  <>
    <header>
      <h1>01 Binary</h1>
    </header>
    
    <main>
      List of articles

      {nodes.map(({
        slug,
        timeToRead,
        frontmatter: {
          title,
          tags
        }
      }) => (
        <article>
          <Link to={`articles/${slug}`}>
            <h2>{title}</h2>
            <div>{timeToRead} min to read</div>
            <div>{tags}</div>
          </Link>
        </article>
      ))}
    </main>
  </>
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
