import React, { FunctionComponent } from "react"
import SEO from '../components/SEO';
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx";
import IArticleQuery from '../models/IArticleQuery'

interface IArticleProps {
    data: IArticleQuery
}

const Article: FunctionComponent<IArticleProps> = ({
    data: {
        mdx: {
            slug,
            body,
            timeToRead,
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
          url={`articles/${slug}`}
        />

        <img src={image}></img>

        <h1>{title} ({slug})</h1>

        <section>
          <span>{date}</span>
          <span>{timeToRead}</span>
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
      timeToRead
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

export default Article;
