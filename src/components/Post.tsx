import React, { useState, FC } from "react"
import styled from 'styled-components';
import Img from "gatsby-image";
import { Link, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import slugify from 'slugify';
import SEO from './SEO';
import TOC from './TOC';
import TagList from './TagList';
import IPost from '../models/IPost';
import IHeading from '../models/IHeading';
import useScrollPosition from '../hooks/useScrollPosition';
import GaugeIcon from '../images/gauge.svg';
import ClockIcon from '../images/clock.svg';
import { Heading } from './Heading';
import Wheel from './Wheel';

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
  max-width: calc(80% - 3em);
  margin-left: 1em;
  margin-bottom: ${props => props.theme.spacing};

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: 100%;
  }
`;

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

const Wheelhouse = styled.section`
  position: sticky;
  float: left;
  left: 0;
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

const SidebarMetadata = styled.section`
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  color: ${props => props.theme.secondaryTextColor};
  margin-top: 0;
  margin-bottom: ${props => props.theme.spacing};

  @media(max-width: ${props => props.theme.mobile}) {
    float: right;
    margin-right: ${props => props.theme.spacingQuarter};
    max-width: 4em;
  }
`;

const StyledGauge = styled(GaugeIcon)`
  float: left;
  margin: .25em .25em 0 .5em;

  #arrow {
    transform: rotate(${props => props.position * 90}deg);
    transform-origin: 45.634px 47.543px;
    transition: transform .3s ease-in-out;
  }

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const Indicator = styled.span`
  font-size: 20pt;
  color: ${props => props.theme.foregroundColor};

  @media(max-width: ${props => props.theme.mobile}) {
    font-size: ${props => props.theme.smallFontSize};
  }
`;

const InlineIndicator = styled.span`
  color: ${props => props.theme.foregroundColor};
`;

const IndicatorLabel = styled.div`
  @media(max-width: ${props => props.theme.mobile}) {
    display: inline;
  }
`;

const StyledClock = styled(ClockIcon)`
  position: relative;
  top: 5px;
`;

const AuthorLink = () => (
  <MetaLink to="/about">
    Valeriy Novytskyy
  </MetaLink>
);

const LocationLink = () => (
  <MetaLink to="#">Portland, OR</MetaLink>
);

const Location = styled.span`
  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

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

const getRelativeDateEmphasis: (relativeDate: string) => string = (
  relativeDate
) => (
  relativeDate.split(' ')[0]
);

const getRelativeDateRemainder: (relativeDate: string) => string = (
  relativeDate
) => (
  relativeDate.split(' ').slice(1).join(' ')
);

interface IPostProps {
  data: IPost
};

const Post: FC<IPostProps> = ({
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
                relativeDate
            },
            fields: {
              url,
              tags
            },
            headings
        }
    }
}) => {
  const [ readPosition, setReadPosition ] = useState<number>(0);

  useScrollPosition((position) => {
    setReadPosition(position);
  }, [readPosition]);

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
          <StyledClock />
          &nbsp;
          <InlineIndicator>{getRelativeDateEmphasis(relativeDate)}</InlineIndicator>
          &nbsp;
          <span>{getRelativeDateRemainder(relativeDate)}</span>
          <span> by <AuthorLink /></span>
          <Location> in <LocationLink /></Location>
        </Metadata>

        <Wheelhouse>
          <Wheel />
        </Wheelhouse>

        <Sidebar>
          <SidebarMetadata>
            <StyledGauge position={readPosition} />
            <Indicator>{timeToRead}</Indicator><span> min </span>
            <IndicatorLabel>to read</IndicatorLabel>
          </SidebarMetadata>
          <TagList tags={tags} />
          <TagList tags={tags} inline />
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
