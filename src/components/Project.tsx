import React, { FunctionComponent } from "react"
import SEO from '../components/SEO';
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
                description,
                image,
                date,
                tags
            }
        }
    }
}) => (
    <main>
        <SEO
          title={title}
          description={description}
          image={image}
          url={`projects/${slug}`}
        />

        <img src={image}></img>

        <h1>{title} ({slug})</h1>

        <section>
          <span>{date}</span>
        </section>

        <section>{tags}</section>

        <MDXRenderer>{body}</MDXRenderer>
    </main>
);

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(slug: { eq: $slug } ) {
      slug
      body
      frontmatter {
        title
        description
        image
        date(fromNow:true)
        tags
      }
    }
  }
`

export default Project;
