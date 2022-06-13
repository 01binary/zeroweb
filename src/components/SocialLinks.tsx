import React, { FC } from 'react';
import styled from 'styled-components';
import Avatar from './Avatar';
import LinkedInIcon from '../images/linkedin.svg';
import GithubIcon from '../images/github.svg';
import StackOverflowIcon from '../images/stack-overflow.svg';
import { useCommentsContext } from '../hooks/useComments';
import { HexLink, HexList } from './HexList';
import AUTHORS from '../../authors.json';
import { MOBILE } from '../constants';

const SOCIAL_ICONS = {
  linkedin: LinkedInIcon,
  stack_overflow: StackOverflowIcon,
  github: GithubIcon,
};

type SocialNetworks = keyof typeof SOCIAL_ICONS;

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

const SocialHeading = styled.div`
  color: ${(props) => props.theme.secondaryTextColor};
  margin-top: ${(props) => props.theme.spacing};
  margin-bottom: ${(props) => props.theme.spacing};

  @media (max-width: ${MOBILE}) {
    display: none;
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

type SocialLinksProps = {
  userName: string;
} & Record<SocialNetworks, string>;

const SocialLinks: FC<SocialLinksProps> = (props) => {
  const { showTipFor, hideTip } = useCommentsContext();
  const { userName } = props;
  const { avatarUrl, location } = AUTHORS[userName];

  return (
    <>
      <AuthorRow>
        <AuthorAvatar avatarUrl={avatarUrl} />
        <AuthorHeader>
          <AuthorName>{userName}</AuthorName>
          <AuthorLocation>{location}</AuthorLocation>
        </AuthorHeader>
      </AuthorRow>

      <MetaRow>
        <SocialHeading>follow me on...</SocialHeading>
        <HexList>
          {Object.keys(SOCIAL_ICONS).map((name, index) => (
            <HexLink
              key={name}
              index={index}
              href={props[name]}
              target="__blank"
              tooltip={name.replace('_', ' ')}
              icon={SOCIAL_ICONS[name]}
              showTipFor={showTipFor}
              hideTip={hideTip}
            />
          ))}
        </HexList>
      </MetaRow>
    </>
  );
};

export default SocialLinks;
