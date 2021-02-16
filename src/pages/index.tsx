import React, { FunctionComponent } from 'react';
import { Link, graphql } from 'gatsby';
import IAllPosts from '../models/IAllPosts';

interface IIndexProps {
  data: IAllPosts
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
        date,
        tags
      },
      fields: {
        collection
      }
    }) => (
      <article key={slug}>
        <Link to={`${collection}/${slug}`}>
          <h2>{title}</h2>
          <section>{date}</section>
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
        fields {
          collection
        }
      }
    }
  }
`

export default Index;
