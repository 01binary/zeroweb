/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Table of Contents component used on posts.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import { AnchorLink } from 'gatsby-plugin-anchor-links';
import styled from 'styled-components';
import useActiveHeading from '../hooks/useActiveHeading';
import HeadingQuery from '../types/HeadingQuery';
import EditGithubIcon from '../images/github.svg';
import { MOBILE } from '../constants';

const Toc = styled.section`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};
  line-height: ${(props) => props.theme.smallFontLineHeight};
  list-style-type: none;
  margin-top: ${(props) => props.theme.spacing};

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;

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
`;

const TocTitle = styled.h2`
  margin-left: 0 !important;

  &:after {
    display: none;
  }

  @media (max-width: ${MOBILE}) {
    position: relative;
    margin-top: -0.25em !important;
  }
`;

const TocList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TocItem = styled.li`
  margin-left: ${(props) => props.depth * props.theme.spacingQuarter};
`;

const TocItemLink = styled(AnchorLink)`
  ${(props) => props.active && `text-decoration: underline`};
  @media (max-width: ${MOBILE}) {
    text-decoration: none;
  }
`;

const EditLink = styled.a`
  display: flex;
  align-items: center;
  text-transform: lowercase;
  margin-right: ${(props) => props.theme.spacingHalf};
`;

const StyledEditIcon = styled(EditGithubIcon)`
  margin-right: ${(props) => props.theme.borderThick};
  margin-left: calc(0px - ${(props) => props.theme.borderThick} * 2);
`;

const getGitHubEditUrl = (url: string) => {
  const parts = url.split('/').filter((part) => part.length);

  const slug = parts[parts.length - 1];
  const collection = parts[parts.length - 2];

  return [
    'https://github.com/01binary/zeroweb/edit/master/src',
    collection,
    `${slug}.md`,
  ].join('/');
};

type TocProps = {
  postUrl: string;
  headings: HeadingQuery[];
  isProject: boolean;
  showLogs: boolean;
};

const TOC: FC<TocProps> = ({ postUrl, headings, isProject, showLogs }) => {
  if (headings.length === 0) return null;

  const active = useActiveHeading(headings);

  return (
    <Toc>
      <TocTitle>{isProject ? 'project' : 'contents'}</TocTitle>
      <TocList>
        {headings.map(({ value, url, slug, depth }) => (
          <TocItem key={url} depth={depth - 2}>
            <TocItemLink to={url} active={slug === active}>
              {value}
            </TocItemLink>
          </TocItem>
        ))}
        {showLogs && (
          <TocItem depth={0}>
            <TocItemLink to={`${postUrl}#logs`}>logs</TocItemLink>
          </TocItem>
        )}
      </TocList>
      <EditLink href={getGitHubEditUrl(postUrl)} target="__blank">
        <StyledEditIcon /> Edit on GitHub
      </EditLink>
    </Toc>
  );
};

export default TOC;
