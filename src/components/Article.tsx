import React, { FunctionComponent } from "react"
import { graphql } from "gatsby"
import IArticleQuery from '../models/IArticleQuery'

interface IArticleProps {
    data: IArticleQuery
}

const Article: FunctionComponent<IArticleProps> = ({
    data: {
        mdx: {
            html,
            frontmatter: {
                title,
                date
            }
        }
    }
}) => (
    <article>
        <h1>{title}</h1>
        <section>{date}</section>
        <section dangerouslySetInnerHTML={{ __html: html }} />
    </article>
);

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(slug: { eq: $slug } ) {
      html
      frontmatter {
        title
        date(fromNow:true)
        tags
      }
    }
  }
`

export default Article;
