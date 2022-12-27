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

import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { Link } from 'gatsby';
import { AnchorLink } from 'gatsby-plugin-anchor-links';
import styled from 'styled-components';
import useActiveHeading from '../hooks/useActiveHeading';
import CubeAnimation from './Animations/CubeAnimation';
import HeadingQuery from '../types/HeadingQuery';
import { MOBILE } from '../constants';
import { useBlogContext } from '../hooks/useBlogContext';
import { getPathForCollection } from '../routes';
import EditLink from '../components/EditLink';
import ScrollToTop from './ScrollToTop';

// How long to wait for smooth scrolling
const AUTOSCROLL_DURATION = 1100;

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

const TocItem = styled.li<{ depth: number }>`
  padding-left: calc(
    ${(props) => props.depth} * ${(props) => props.theme.spacingHalf}
  );
`;

const TocItemLink = styled(AnchorLink)`
  ${(props) => props.active && `text-decoration: underline`};

  // Fix Safari flicker by forcing a 3D layer
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;

  @media (max-width: ${MOBILE}) {
    text-decoration: none;
    transform-style: initial;
    backface-visibility: initial;
    will-change: initial;
  }
`;

const BackToIndexLink = styled(Link)`
  display: block;
  margin-left: -1.25em;

  @media (max-width: ${MOBILE}) {
    margin-left: initial;
  }
`;

const TocEditLink = styled(EditLink)`
  margin-right: ${(props) => props.theme.spacingHalf};
`;

const getAnchorFromHref = (url?: string) =>
  url && url.substring(url.indexOf('#') + 1);

const TOC: FC<{
  postUrl: string;
  headings: HeadingQuery[];
  isProject: boolean;
  showLogs: boolean;
  readPosition: number;
}> = ({ postUrl, headings, isProject, showLogs, readPosition }) => {
  const { anchor, setAnchor } = useBlogContext();
  const heading = useActiveHeading(headings);
  const isAutoScrollingRef = useRef<boolean>(false);
  const backToIndex = useMemo(
    () =>
      isProject
        ? getPathForCollection('projects')
        : getPathForCollection('articles'),
    [isProject]
  );

  const resetAnchor = useCallback(() => {
    if (!isAutoScrollingRef.current && anchor) setAnchor(null);
  }, [anchor, setAnchor]);

  useEffect(() => {
    if (typeof window === `undefined`) return;

    window.addEventListener('scroll', resetAnchor);

    return () => {
      window.removeEventListener('scroll', resetAnchor);
    };
  }, [resetAnchor]);

  const active = anchor ?? heading;

  if (headings.length === 0) return null;

  return (
    <Toc>
      <TocTitle>{isProject ? 'project' : 'contents'}</TocTitle>
      <BackToIndexLink to={backToIndex}>← back to index</BackToIndexLink>
      <TocList>
        {headings.map(({ value, url, slug, depth }) => (
          <TocItem
            key={url}
            depth={depth - 2}
            onClick={(e) => {
              setAnchor(getAnchorFromHref(e.target.href) ?? null);
              isAutoScrollingRef.current = true;
              window.setTimeout(() => {
                isAutoScrollingRef.current = false;
              }, AUTOSCROLL_DURATION);
            }}
          >
            <TocItemLink to={url} active={slug === active}>
              {slug === active && <CubeAnimation position={readPosition} />}
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
      <TocEditLink path={postUrl} />
      <ScrollToTop inline readPosition={readPosition} />
    </Toc>
  );
};

export default TOC;
