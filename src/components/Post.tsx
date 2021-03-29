import React, { FunctionComponent } from "react"
import styled from 'styled-components';
import Img from "gatsby-image";
import { Link, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import slugify from 'slugify';
import SEO from './SEO';
import TOC from './TOC';
import { Heading } from './Heading';
import TagList from './TagList';
import IPost from '../models/IPost';
import IHeading from '../models/IHeading';
import Clock from '../images/clock.svg';

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

  @media(max-width: ${props => props.theme.mobile}) {
    h1, h2, h3, h4 {
      max-width: initial;
      margin-left: ${props => props.theme.spacingHalf};
    }
  }

  h1:hover,
  h2:hover,
  h3:hover,
  h4:hover {
    a {
      opacity: 1;
    }
  }

  @media(max-width: ${props => props.theme.desktop}) {
    &:before, &:after {
      content: '';
    }
  }
`;

const HeroImage = styled(Img)`
  max-height: 280px;
  max-width: calc(80% - 3em);
  margin-right: 1.5em;
  margin-left: ${props => props.theme.spacingHalf};

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: 100%;
    margin-right: 0;
  }
`;

const Metadata = styled.section`
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  color: ${props => props.theme.secondaryTextColor};
  display: flex;
  flex-wrap: wrap;
  max-width: calc(80% - 3em);
  margin-left: 1em;
  margin-bottom: ${props => props.theme.spacing};

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: 100%;
  }
`

const SidebarMetadata = styled.section`
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  color: ${props => props.theme.secondaryTextColor};
`;

const MetaProp = styled.div`
  margin-right: ${props => props.theme.spacingHalf};
`

const MetaLink = styled(Link)`
  border-bottom-width: ${props => props.theme.border};
  border-bottom-style: dotted;
  border-bottom-color: ${props => props.theme.accentTextColor};
  text-decoration: none;

  transition:
    border-bottom-color ${props => props.theme.animationFast} ease-out;

  &:hover {
    border-bottom-color: ${props => props.theme.primaryColor};
    text-decoration: none;
  }
`;

const Content = styled.section`
  max-width: calc(80% - 2em);

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: 100%;
  }
`;

const Sidebar = styled.section`
  position: sticky;
  float: right;
  top: 0;
  left: 100%;
  min-width: 20%;
  max-width: 20%;
  margin-top: -6em;
  padding-top: 1em;

  @media(max-width: ${props => props.theme.mobile}) {
    position: relative;
    float: none;
    left: 0;
    max-width: 100%;
    margin-top: -1em;
    margin-left: ${props => props.theme.spacingHalf};
  }
`;

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
                relativeDate,
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
          <MetaProp>By <AuthorLink /></MetaProp>
          <MetaProp>{relativeDate}</MetaProp>
          <MetaProp><LocationLink /></MetaProp>
        </Metadata>

        <Sidebar>
          <SidebarMetadata>
            <Clock /> {timeToRead} min to read
          </SidebarMetadata>
          <TagList tags={tags} />
          <TOC headings={slugifyHeadings(url, headings)} />
        </Sidebar>

        <HeroImage fluid={fluid} />

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
        relativeDate: date(fromNow: true)
        date(formatString: "MMM DD, YYYY")
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
