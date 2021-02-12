import React, { FunctionComponent } from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx";
import IArticleQuery from '../models/IArticleQuery'

interface IProjectProps {
    data: IArticleQuery
}

const Project: FunctionComponent<IProjectProps> = ({
    data: {
        mdx: {
            slug,
            body,
            frontmatter: {
                title,
                date,
                tags
            }
        }
    }
}) => (
    <article>
        <h1>{title} ({slug})</h1>
        <section>{date}</section>
        <section>{tags}</section>
        <MDXRenderer>{body}</MDXRenderer>
    </article>
);

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(slug: { eq: $slug } ) {
      slug
      body
      frontmatter {
        title
        date(fromNow:true)
        tags
      }
    }
  }
`

export default Project;
