import React, { FunctionComponent } from 'react';
import { Link, graphql } from 'gatsby';
import IProjectsQuery from '../models/IProjectsQuery';

interface IIndexProps {
  data: IProjectsQuery
};

const Index: FunctionComponent<IIndexProps> = ({
  data: { allMdx: { nodes } }
}) => (
  <main>
    <h1>Projects</h1>

    {nodes.map(({
      slug,
      frontmatter: {
        title,
        tags
      }
    }) => (
      <article>
        <Link to={slug}>
          <h2>{title}</h2>
          <section>{tags}</section>
        </Link>
      </article>
    ))}
  </main>
);

export const query = graphql`
  query {
    allMdx (
      sort: { fields: [frontmatter___date], order: DESC },
      filter: { fields: { collection: { eq: "projects" } } }
    ) {
      nodes {
        slug
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
