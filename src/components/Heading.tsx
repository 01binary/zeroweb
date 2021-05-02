/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Heading component used on pages and in markdown (MDX).
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import slugify from 'slugify';
import styled from 'styled-components';
import { useBlogContext } from '../hooks/useBlogContext';
import PermaLink from './PermaLink';

const HeadingWrapper = styled.div`
    position: relative;
    margin: 0;
    padding: 0;

    .permalink-icon {
        transition: opacity ${props => props.theme.animationFast} ease-out;
        opacity: 0;
    }

    &:hover {
        .permalink-icon {
            opacity: 1;
        }
    }
`;

const HeadingText = styled.span`
    margin-right: 0.33em;
`;

export const getHeadingSlug = (
  main: boolean,
  text: string
): string => (
  main ? null : slugify(text, { lower: true })
);

export const getHeadingUrl = (
  baseUrl: string,
  slug?: string,
): string => (
  slug ? `${baseUrl}#${slug}` : baseUrl
);

interface HeadingProps {
  level?: number;
  className: string;
};

export const Heading: FC<HeadingProps> = ({
  level = 1,
  children,
  className
}) => {
  const { url } = useBlogContext();
  const slug = getHeadingSlug(level === 1, children.toString());
  const permaLinkUrl = getHeadingUrl(url, slug);
  const HeadingElement: any = `h${level}`;

  return (
    <HeadingWrapper className={className}>
      <PermaLink url={permaLinkUrl} level={level} />
      <HeadingElement id={slug}>
        <HeadingText>{children}</HeadingText>
        <PermaLink url={permaLinkUrl} level={level} inline />
      </HeadingElement>
    </HeadingWrapper>
  );
};

export const Heading1: FC = ({ children }) => (
  <Heading level={1}>{children}</Heading>
);

export const Heading2: FC = ({ children }) => (
  <Heading level={2}>{children}</Heading>
);

export const Heading3: FC = ({ children }) => (
  <Heading level={3}>{children}</Heading>
);

export const Heading4: FC = ({ children }) => (
  <Heading level={4}>{children}</Heading>
);
