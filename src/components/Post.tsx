import React, { FunctionComponent } from "react"
import styled from 'styled-components';
import Img from "gatsby-image";
import { Link, graphql } from "gatsby";
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

  h1:hover,
  h2:hover,
  h3:hover,
  h4:hover {
    a {
      opacity: .6;
    }
  }
`;

const Tags = styled.ul``

const Tag = styled.li``

const Metadata = styled.section`
  font: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  margin-left: 1em;
  margin-bottom: ${props => props.theme.spacing};
  display: flex;
`

const MetaProp = styled.div`
  margin-right: ${props => props.theme.spacingHalf};
`

const MetaLink = styled(Link)`
  border-bottom-width: ${props => props.theme.border};
  border-bottom-style: dotted;
  border-bottom-color: ${props => props.theme.accentTextColor};
  text-decoration: none;

  transition:
    color ${props => props.theme.animationFast} ease-out,
    border-bottom-color ${props => props.theme.animationFast} ease-out;

  &:hover {
    border-bottom-color: ${props => props.theme.primaryColor};
  }
`;

const Permalink = styled(Link)`
  opacity: 0;
  color: ${props => props.theme.shadowDarkColor};
  transition: opacity ${props => props.theme.animationFast} ease-out;
  margin-right: .25em;
  margin-left: -.25em;
`;

const AuthorLink = () => (
  <MetaLink to="/about">
    Valeriy Novytskyy
  </MetaLink>
);

const LocationLink = () => (
  <MetaLink to="#">Portland, OR</MetaLink>
);

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
}) => {
  const copyLink = () => navigator.clipboard.writeText(
    window.location.protocol + '//' + window.location.host + url);

  return (
    <Main>
        <SEO
          title={title}
          description={description}
          image={fluid.src}
          url={url}
        />

        <h1>
          <Permalink to={url} onClick={copyLink}>
            #
          </Permalink>
          {title}
        </h1>

        <Metadata>
          <MetaProp><AuthorLink /></MetaProp>
          <MetaProp>{date}</MetaProp>
          <MetaProp><LocationLink /></MetaProp>
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
};

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
