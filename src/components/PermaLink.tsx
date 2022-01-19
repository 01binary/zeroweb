/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Permalink that appears when hovering over headings.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { useTooltip } from '../hooks/useTooltip';
import { Tooltip, Arrow } from './Tooltip';
import LinkIcon from '../images/link.svg';
import MouseIcon from '../images/mouse.svg';
import { MOBILE } from '../constants';

interface StyledProps {
  level: number;
  theme: { [key: string]: string };
}

const getLinkIconSize = ({
  level,
  theme: { headingFontSizeLarge, headingFontSizeMedium, headingFontSizeSmall },
}: StyledProps): string => {
  const sizeWithUnits =
    level === 1
      ? headingFontSizeLarge
      : level === 2
      ? headingFontSizeMedium
      : headingFontSizeSmall;

  return `calc(${sizeWithUnits} + 2pt)`;
};

const PermaLinkAnchorInline = styled(Link)`
  position: relative;
  display: inline;
  color: ${(props) => props.theme.secondaryTextColor};
  top: 2px;

  .fill-foreground {
    fill: ${(props) => props.theme.secondaryTextColor};
  }

  @media (min-width: ${MOBILE}) {
    display: none;
  }
`;

const PermaLinkAnchor = styled(Link)`
  position: absolute;
  top: 0;
  left: calc(
    0px - ${(props) => getLinkIconSize(props)} +
      ${(props) => props.theme.spacingSmall}
  );
  height: ${(props) => getLinkIconSize(props)};
  opacity: 1;
  color: ${(props) => props.theme.secondaryTextColor};
  transition: opacity ${(props) => props.theme.animationFast} ease-out;
  display: flex;
  align-items: center;

  .fill-foreground {
    fill: ${(props) => props.theme.secondaryTextColor};
  }

  @media (max-width: ${MOBILE}) {
    display: none;

    .permalink-icon {
      display: none;
    }
  }
`;

const StyledLinkIcon = styled(LinkIcon).attrs((props) => ({
  className: props.inline ? 'permalink-icon--inline' : 'permalink-icon',
}))`
  height: ${(props) => getLinkIconSize(props)};
`;

const StyledMouseIcon = styled(MouseIcon)`
  position: relative;
  width: 1.3em;
  height: 1.3em;
  margin-top: -0.3em;
  margin-right: ${(props) => props.theme.spacingQuarter};
  top: ${(props) => props.theme.spacingMin};

  @media (max-width: ${MOBILE}) {
    display: none;
  }
`;

const NoWrap = styled.span`
  white-space: nowrap;
`;

interface PermaLinkProps {
  url: string;
  level: number;
  inline?: boolean;
}

const PermaLink: FC<PermaLinkProps> = ({ url, level, inline }) => {
  const { showTip, hideTip, tipProps, tipRef, targetRef } = useTooltip({
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 5,
    placement: 'bottom',
  });

  const [isCopied, setCopied] = useState(false);

  const copyLink = useCallback(() => {
    try {
      window.navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (e) {
      console.error(e);
    }
  }, [setCopied, setTimeout]);

  const Anchor = inline ? PermaLinkAnchorInline : PermaLinkAnchor;

  return (
    <Anchor
      to={url}
      level={level}
      ref={targetRef}
      onClick={copyLink}
      onMouseOver={() => showTip(null)}
      onMouseOut={() => hideTip()}
    >
      <StyledLinkIcon level={level} inline={inline ? 1 : 0} />
      <Tooltip ref={tipRef} {...tipProps}>
        <NoWrap>
          {!isCopied && <StyledMouseIcon />}
          {isCopied ? 'copied!' : 'copy link'}
        </NoWrap>
        <Arrow />
      </Tooltip>
    </Anchor>
  );
};

export default PermaLink;
