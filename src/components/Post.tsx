import React, { FunctionComponent } from "react"
import Img from "gatsby-image";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import SEO from './SEO';
import IPostQuery from '../models/IPost';

interface IPostProps {
    data: IPostQuery
}

const Post: FunctionComponent<IPostProps> = ({
    data: {
        mdx: {
            slug,
            body,
            timeToRead,
            frontmatter: {
                title,
                description,
                image: {
                  childImageSharp: { fluid }
                },
                date,
                tags
            },
            fields: {
              collection
            }
        }
    }
}) => (
    <main>
        <SEO
          title={title}
          description={description}
          image={fluid.src}
          url={`${collection}/${slug}`}
        />

        <Img fluid={fluid} />

        <h1>{title}</h1>

        <section>
          <span>{date}</span>
          <span>{timeToRead}</span>
        </section>

        <section>
          {tags}
        </section>

        <MDXRenderer>
          {body}
        </MDXRenderer>
    </main>
);

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(slug: { eq: $slug } ) {
      slug
      body
      timeToRead
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

export default Post;
