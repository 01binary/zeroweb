import React, { FunctionComponent } from "react"
import styled from 'styled-components';
import Img from "gatsby-image";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import SEO from './SEO';
import IPostQuery from '../models/IPost';

const Main = styled.main`
  h2 {
    font-size: ${props => props.theme.headingFontSizeMedium};
    margin-bottom: .3em;
  }

  h3 {
    font-size: ${props => props.theme.headingFontSizeSmall};
  }

  h4 {
    font-size: ${props => props.theme.headingFontSizeSmaller};
  }

  h2, h3, h4 {
    text-transform: lowercase;
    font-family: ${props => props.theme.headingFont};
    font-weight: ${props => props.theme.headingFontWeight};
    margin-bottom: ${props => props.theme.margin};
    margin-top: ${props => props.theme.margin};
    padding-left: 1.2em;
    clear: left;
  }

  h3, h4 {
    margin-left: 1.2em;
  }

  h2:hover,
  h3:hover,
  h4:hover {
    .permalink-anchor {
      opacity: 1;
    }
  }
`;

const Tags = styled.ul``

const Tag = styled.li``

const Metadata = styled.section``

const MetaProp = styled.span``

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
    <Main>
        <SEO
          title={title}
          description={description}
          image={fluid.src}
          url={url}
        />

        <h1>{title}</h1>

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
    </Main>
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
