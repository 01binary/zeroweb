import React, { FunctionComponent } from "react"
import styled from 'styled-components';
import Img from "gatsby-image";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import SEO from './SEO';
import IPostQuery from '../models/IPost';

const Title = styled.h1`
  color:gray
`

const Tags = styled.ul`
  color: green;
`

const Tag = styled.li`
  border: 1px solid gray;
`

const Metadata = styled.section`
  color: darkgray;
`

const MetaProp = styled.span`
  margin-right: 2pt
`

interface IPostProps {
  data: IPostQuery
}

const Post: FunctionComponent<IPostProps> = ({
    data: {
        mdx: {
            body,
            timeToRead,
            frontmatter: {
                title,
                description,
                image: {
                  childImageSharp: { fluid }
                },
                date
            },
            fields: {
              url,
              tags
            }
        }
    }
}) => (
    <main>
        <SEO
          title={title}
          description={description}
          image={fluid.src}
          url={url}
        />

        <Title>{title}</Title>

        <Metadata>
          <MetaProp>{date}</MetaProp>
          <MetaProp>{timeToRead} min to read</MetaProp>
        </Metadata>

        <Img fluid={fluid} />

        <MDXRenderer>
          {body}
        </MDXRenderer>

        <Tags>
          {tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
        </Tags>
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
        url,
        collection,
        tags
      }
    }
  }
`

export default Post;
