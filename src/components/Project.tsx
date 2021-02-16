import React, { FunctionComponent } from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx";
import Img from "gatsby-image";
import SEO from '../components/SEO';
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
                image: {
                  childImageSharp: { fluid }
                },
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
          url={`projects/${slug}`}
        />

        <Img fluid={fluid} />

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
        image {
          childImageSharp {
            fluid(maxWidth:800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        date(fromNow:true)
        tags
      }
      fields {
        collection
      }
    }
  }
`

export default Project;
