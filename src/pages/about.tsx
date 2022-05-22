/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  About page.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useRef } from 'react';
import styled from 'styled-components';
import Title from '../components/Title';
import {
  CELL_HEIGHT,
  CELL_ICON_SIZE,
  CELL_PATTERN,
  CELL_STRIP_HEIGHT,
  CELL_WIDTH,
  MOBILE,
} from '../constants';
import Avatar from '../components/Avatar';
import Cell from '../images/cell.svg';
import authors from '../../authors.json';
import LinkedInIcon from '../images/linkedin.svg';
import GithubIcon from '../images/github.svg';
import StackOverflowIcon from '../images/stack-overflow.svg';
import HelloAnimation from '../components/Animations/HelloAnimation';
import { Heading3 } from '../components/Heading';
import { List } from '../components/Post/UnorderedList';
import { useTooltip } from '../hooks/useTooltip';
import { Arrow, Tooltip } from '../components/Tooltip';

const userName = 'Valeriy Novytskyy';
const locationName = 'Portland, OR';
const author = {
  userName,
  locationName,
  ...authors[userName],
  social: [
    {
      name: 'linkedin',
      href: 'https://www.linkedin.com/in/valeriy-n-2967487/',
      icon: LinkedInIcon,
    },
    {
      name: 'stack overflow',
      href: 'https://stackoverflow.com/users/3727395/valeriy-novytskyy',
      icon: StackOverflowIcon,
    },
    {
      href: 'https://github.com/01binary',
      name: 'github',
      icon: GithubIcon,
    },
  ],
};

const AboutPage = styled.main`
  position: relative;
  margin-bottom: calc(${(props) => props.theme.spacing} * 5);

  animation: slideIn ${(props) => props.theme.animationSlow} ease-out 1;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media (max-width: ${MOBILE}) {
    margin-bottom: initial;
  }
`;

const AboutAnimation = styled(HelloAnimation)`
  position: absolute;
  left: 0;
  top: calc(${(props) => props.theme.spacing} * 1.7);
  z-index: -1;

  @media (max-width: ${MOBILE}) {
    position: initial;
    margin-bottom: ${(props) => props.theme.spacingHalf};
  }
`;

const Greeting = styled.span`
  display: block;
  margin-bottom: ${(props) => props.theme.spacingHalf};
`;

const Paragraph = styled.p`
  max-width: calc(80% - 3em - ${(props) => props.theme.spacing} * 5);
  margin-left: calc(${(props) => props.theme.spacing} * 5);

  @media (max-width: ${MOBILE}) {
    max-width: 100%;
    margin-left: ${(props) => props.theme.spacingHalf};
  }
`;

const HeavyHighlight = styled.span`
  font-weight: 500;
  color: ${(props) => props.theme.secondaryTextColor};
`;

const Highlight = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;

const Heading = styled(Heading3)`
  @media (max-width: ${MOBILE}) {
    margin-left: initial;
  }
`;

const HeroParagraph = styled(Paragraph)`
  font-family: 'Roboto', sans-serif;
  font-size: 18pt;
  font-weight: 300;
  margin-block-start: 0;
`;

const AuthorAvatar = styled(Avatar)`
  flex-basis: 38px;
  flex-grow: 0;
  flex-shrink: 0;

  .stroke-border {
    stroke: ${(props) => props.theme.focusColor};
    stroke-width: ${(props) => props.theme.border};
  }
`;

const AuthorRow = styled.section`
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacingHalf};

  @media (max-width: ${MOBILE}) {
    flex: content 0 0;
    margin-right: ${(props) => props.theme.spacingHalf};
  }
`;

const MetaRow = styled.section<{ desktopOnly: boolean }>`
  margin-bottom: ${(props) => props.theme.spacingHalf};
  margin-left: calc(
    ${(props) => props.theme.spacingOneAndHalf} +
      ${(props) => props.theme.spacingQuarter}
  );

  @media (max-width: ${MOBILE}) {
    ${(props) => props.desktopOnly && `display: none`};
    flex: content 0 0;
    margin-left: 0;
  }
`;

const AuthorHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => props.theme.spacingHalf};
`;

const AuthorName = styled.div`
  font-weight: 400;
`;

const AuthorLocation = styled.div`
  color: ${(props) => props.theme.secondaryTextColor};
`;

const Sidebar = styled.aside`
  position: sticky;
  float: right;
  top: 0;
  left: 100%;
  width: calc(20% + 2em);

  @media (max-width: ${MOBILE}) {
    position: initial;
    float: initial;
    width: initial;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: fit-content;
    margin-left: ${(props) => props.theme.spacingHalf};
  }
`;

const Social = styled.ul`
  position: relative;
  list-style-type: none;
  margin-block-end: 0;
  margin-right: 0;
  overflow: hidden;
  height: ${CELL_STRIP_HEIGHT}px;
  width: ${CELL_WIDTH * 2}px;
  margin-top: 0;

  @media (min-width: ${MOBILE}) {
    margin-top: calc(
      ${(props) => props.theme.spacingHalf} +
        ${(props) => props.theme.spacingQuarter}
    );
    margin-bottom: ${(props) => props.theme.spacing};
  }
`;

const SocialItem = styled.li`
  position: absolute;
  left: ${(props) => CELL_PATTERN[props.index].x}px;
  top: ${(props) => CELL_PATTERN[props.index].y - CELL_HEIGHT}px;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;

  .tag__icon {
    position: absolute;
    left: ${(CELL_WIDTH - CELL_ICON_SIZE) / 2}px;
    top: ${(CELL_HEIGHT - CELL_ICON_SIZE) / 2}px;
  }
`;

const SocialBorder = styled(Cell)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const SocialLink = styled.a`
  position: absolute;
  width: 100%;
  height: 100%;

  svg {
    pointer-events: none;
  }

  .tag__icon {
    opacity: 0.85;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
  }

  &:hover {
    .tag__icon {
      opacity: 1;
    }
  }

  &:focus {
    z-index: 1;
    outline: none;
    border-radius: initial;
    box-shadow: initial;

    .stroke-border {
      stroke: ${(props) => props.theme.focusColor};
    }
  }
`;

const AboutList = styled(List)`
  max-width: calc(80% - 3em - ${(props) => props.theme.spacing});

  @media (max-width: ${MOBILE}) {
    margin-left: 0;
    margin-right: ${(props) => props.theme.spacingHalf};
    max-width: initial;
  }
`;

const About: FC = () => {
  const tooltipTargetRef = useRef<HTMLElement>(null);
  const { showTipFor, hideTip, tipProps, tipRef, tooltipText } = useTooltip({
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 5,
    placement: 'top',
  });

  const showTextTip = (text: string) => (e: MouseEvent) => {
    tooltipTargetRef.current = e.target as HTMLElement;
    showTipFor(text, tooltipTargetRef);
  };

  return (
    <>
      <AboutPage>
        <Title collection="about">About</Title>

        <Sidebar>
          <AuthorRow>
            <AuthorAvatar avatarUrl={author.avatarUrl} />
            <AuthorHeader>
              <AuthorName>{author.userName}</AuthorName>
              <AuthorLocation>{author.locationName}</AuthorLocation>
            </AuthorHeader>
          </AuthorRow>

          <MetaRow>
            <Social>
              {author.social.map(({ name, href, icon: Icon }, index) => (
                <SocialItem key={name} index={index}>
                  <SocialLink
                    href={href}
                    target="__blank"
                    onMouseOver={showTextTip(name)}
                    onMouseOut={hideTip}
                  >
                    <SocialBorder />
                    <Icon className="tag__icon" />
                  </SocialLink>
                </SocialItem>
              ))}
            </Social>
          </MetaRow>
        </Sidebar>

        <AboutAnimation />

        <HeroParagraph>
          <Greeting>Hi there,</Greeting>I use my passion for{' '}
          <HeavyHighlight>engineering</HeavyHighlight> and{' '}
          <HeavyHighlight>design</HeavyHighlight> to build sustainable products
          that stand out.
        </HeroParagraph>

        <HeroParagraph>
          Follow my adventures in{' '}
          <HeavyHighlight>software development</HeavyHighlight>
          {', '}
          <HeavyHighlight>industrial design</HeavyHighlight> and{' '}
          <HeavyHighlight>robotics</HeavyHighlight> on this blog!
        </HeroParagraph>

        <Heading>what I do...</Heading>

        <AboutList>
          <li>
            Full-stack <Highlight>web developer</Highlight> and{' '}
            <Highlight>cloud architect</Highlight> in the healthcare industry,
            focusing on <Highlight>user experience</Highlight> and specializing
            in data processing &amp; visualization for connected{' '}
            <Highlight>medical devices</Highlight>.
          </li>
          <li>
            Deliver <Highlight>practical solutions</Highlight> with{' '}
            <Highlight>clear value</Highlight> by growing a deep understanding
            of the business domain through <Highlight>research</Highlight> and
            relentless <Highlight>experimentation</Highlight>.
          </li>
          <li>
            Believe that developing <Highlight>capable leaders</Highlight> is
            the best way to increase <Highlight>team capacity</Highlight> and{' '}
            <Highlight>grow</Highlight> the organization.
          </li>
        </AboutList>
      </AboutPage>
      <Tooltip ref={tipRef} {...tipProps}>
        {tooltipText}
        <Arrow />
      </Tooltip>
    </>
  );
};

export default About;
