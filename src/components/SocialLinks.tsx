import React, { FC, useRef } from 'react';
import styled from 'styled-components';
import Avatar from './Avatar';
import Cell from '../images/cell.svg';
import LinkedInIcon from '../images/linkedin.svg';
import GithubIcon from '../images/github.svg';
import StackOverflowIcon from '../images/stack-overflow.svg';
import authors from '../../authors.json';
import {
  CELL_HEIGHT,
  CELL_ICON_SIZE,
  CELL_PATTERN,
  CELL_STRIP_HEIGHT,
  CELL_WIDTH,
  MOBILE,
} from '../constants';
import { useCommentsContext } from '../hooks/useComments';

const getAuthorInfo = (userName: string) => ({
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
});

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

const SocialHeading = styled.span`
  display: block;
  color: ${(props) => props.theme.secondaryTextColor};
  margin-top: ${(props) => props.theme.spacingHalf};
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
  float: right;
  width: calc(20% + 2em);
  margin-left: 2em;

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

type AboutSidebarProps = {
  userName: string;
  locationName: string;
};

const AboutSidebar: FC<AboutSidebarProps> = ({ userName, locationName }) => {
  const tooltipTargetRef = useRef<HTMLElement>(null);
  const { showTipFor, hideTip } = useCommentsContext();

  const showTextTip = (text: string) => (e: MouseEvent) => {
    tooltipTargetRef.current = e.target as HTMLElement;
    showTipFor(text, tooltipTargetRef);
  };

  const { avatarUrl, social } = getAuthorInfo(userName);

  return (
    <Sidebar>
      <AuthorRow>
        <AuthorAvatar avatarUrl={avatarUrl} />
        <AuthorHeader>
          <AuthorName>{userName}</AuthorName>
          <AuthorLocation>{locationName}</AuthorLocation>
        </AuthorHeader>
      </AuthorRow>

      <MetaRow>
        <SocialHeading>follow me on...</SocialHeading>
        <Social>
          {social.map(({ name, href, icon: Icon }, index) => (
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
  );
};

export default AboutSidebar;
