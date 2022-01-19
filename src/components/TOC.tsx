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
import { MOBILE } from '../constants';

const Toc = styled.section`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};
  line-height: ${(props) => props.theme.smallFontLineHeight};
  list-style-type: none;
  margin-top: ${(props) => props.theme.spacing};
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
    text-decoration: underline;
  }
`;

type TocProps = {
  headings: Array<HeadingQuery>;
};

const TOC: FC<TocProps> = ({ headings }) => {
  if (headings.length === 0) return null;

  const active = useActiveHeading(headings);

  return (
    <Toc>
      <TocTitle>Contents</TocTitle>
      <TocList>
        {headings.map(({ value, url, slug, depth }) => (
          <TocItem key={url} depth={depth - 2}>
            <TocItemLink to={url} active={slug === active}>
              {value}
            </TocItemLink>
          </TocItem>
        ))}
      </TocList>
    </Toc>
  );
};

export default TOC;
