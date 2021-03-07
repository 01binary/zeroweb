import React, { FunctionComponent } from "react"
import styled from 'styled-components';
import Img from "gatsby-image";
import { Link, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import slugify from 'slugify';
import SEO from './SEO';
import TOC from './TOC';
import { Heading } from './Heading';
import IPost from '../models/IPost';
import IHeading from '../models/IHeading';

const Main = styled.main`
  h1 {
    max-width: calc(75% - 1.5em);
  }

  h2 {
    font-size: ${props => props.theme.headingFontSizeMedium};
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
    clear: left;
  }

  h1:hover,
  h2:hover,
  h3:hover,
  h4:hover {
    a {
      opacity: 1;
    }
  }
`;

const HeroImage = styled(Img)`
  max-height: 280px;
  max-width: calc(75% - 3em);
  margin-left: 1em;
  margin-right: 1.5em;
`;

const Metadata = styled.section`
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  color: ${props => props.theme.secondaryTextColor};
  display: flex;
  margin-left: 1em;
  margin-bottom: ${props => props.theme.spacing};
  max-width: calc(75% - 3em);
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

const Content = styled.section`
  max-width: calc(75% - 2em);
`;

const Sidebar = styled.section`
  @media(max-width: ${props => props.theme.wide}) {
    position: sticky;
    top: 0;
    left: 100%;
    float: right;
    min-width: 25%;
    max-width: 25%;
    margin-top: calc(-280px + 1em);
  }
`;

const Tags = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 0;
`; 

const Tag = styled.li`
  border: 1px solid black;
`

const AuthorLink = () => (
  <MetaLink to="/about">
    Valeriy Novytskyy
  </MetaLink>
);

const LocationLink = () => (
  <MetaLink to="#">Portland, OR</MetaLink>
);

const slugifyHeadings = (
  baseUrl: string,
  headings: IHeading[]
): IHeading[] => headings.map((heading) => {
  const slug = slugify(heading.value, { lower: true });
  return {
      ...heading,
      url: `${baseUrl}#${slug}`,
      slug
  };
});

interface IPostProps {
  data: IPost
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
            },
            headings
        }
    }
}) => {
  return (
    <Main>
        <SEO
          title={title}
          description={description}
          image={fluid.src}
          url={url}
        />

        <Heading>{title}</Heading>

        <Metadata>
          <MetaProp><AuthorLink /></MetaProp>
          <MetaProp>{date}</MetaProp>
          <MetaProp><LocationLink /></MetaProp>
          <MetaProp>{timeToRead} min to read</MetaProp>
        </Metadata>

        <HeroImage fluid={fluid} />

        <Sidebar>
          <Tags>
            {tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
          </Tags>

          <TOC headings={slugifyHeadings(url, headings)} />
        </Sidebar>

        <Content>
          <MDXRenderer>
            {body}
          </MDXRenderer>
        </Content>
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
            fluid(maxWidth:768, maxHeight:280) {
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
      headings {
        value
        depth
      }
    }
  }
`

export default Post;
