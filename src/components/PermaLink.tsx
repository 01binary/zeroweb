import React, { FunctionComponent, useState } from "react"
import styled from 'styled-components';
import { Link } from 'gatsby';
import LinkIcon from '../images/link.svg';
import MouseIcon from '../images/mouse.svg'

const Tooltip = styled.div.attrs(() => ({
  className: "tooltip"
}))`
  z-index: 6;
  position: absolute;
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
  color: ${props => props.theme.primaryTextColor};
  position: absolute;
  line-height: ${props => props.theme.spacing};
  background: ${props => props.theme.dropShadowTransparentColor};
  padding: ${props => props.theme.spacingQuarter} ${props => props.theme.spacingHalf};
  left: 50%;
  bottom: calc(100% + .9em);
  width: max-content;
  opacity: 0;
  transform: translateY(${props => props.theme.spacingThird});
  transition:
    opacity ${props => props.theme.animationFast} ease-in-out,
    transform ${props => props.theme.animationFast} ease-in-out;
  pointer-events: none;

  &:before {
    content: '';
    position: absolute;
    top: 100%;
    left: 0px;
    border-width: 6px;
    border-style: solid;
    border-color:
      ${props => props.theme.dropShadowTransparentColor}
      transparent
      transparent
      ${props => props.theme.dropShadowTransparentColor};
  }
`;

interface StyledProps {
  level: number,
  theme: { [key: string]: string}
};

const getLinkIconSize = ({
  level,
  theme: {
    headingFontSizeLarge,
    headingFontSizeMedium,
    headingFontSizeSmall
  }
}: StyledProps): string => {
  const sizeWithUnits =
      level === 1
    ? headingFontSizeLarge
    : level === 2
    ? headingFontSizeMedium
    : headingFontSizeSmall;

  return (
    // Extract value without units, assume pt
    parseInt(sizeWithUnits.substring(0, sizeWithUnits.length - 2)) +
    // Add 2 points
    2 +
    // Add units back
    'pt'
  );
};

const PermaLinkAnchorInline = styled(Link)`
  position: relative;
  display: inline;
  color: ${props => props.theme.secondaryTextColor};
  top: 2px;

  .fill-foreground {
    fill: ${props => props.theme.secondaryTextColor};
  }

  &:hover .tooltip {
    opacity: .8;
    transform: translateY(0);
  }

  @media(min-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

const PermaLinkAnchor = styled(Link)`
  position: absolute;
  top: 0;
  left: calc(-${props => getLinkIconSize(props)} + ${props => props.theme.spacingSmall});
  height: ${props => getLinkIconSize(props)};
  opacity: 1;
  color: ${props => props.theme.secondaryTextColor};
  transition: opacity ${props => props.theme.animationFast} ease-out;
  display: flex;
  align-items: center;

  .fill-foreground {
    fill: ${props => props.theme.secondaryTextColor};
  }

  &:hover .tooltip {
    opacity: .8;
    transform: translateY(0);
  }

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;

    .permalink-icon {
      display: none;
    }
  }
`;

const StyledLinkIcon = styled(LinkIcon).attrs(
  (props) => ({
    className: props.inline
      ? 'permalink-icon--inline'
      : 'permalink-icon'
  })
)`
  height: ${props => getLinkIconSize(props)};
`;

const StyledMouseIcon = styled(MouseIcon)`
  position: relative;
  width: 1.3em;
  height: 1.3em;
  top: ${props => props.theme.spacingMin};
  margin-right: ${props => props.theme.spacingQuarter};

  @media(max-width: ${props => props.theme.mobile}) {
    display: none;
  }
`;

interface PermaLinkProps {
  url: string,
  level: number,
  inline?: boolean
}

const PermaLink: FunctionComponent<PermaLinkProps> = ({
  url,
  level,
  inline
}) => {
  const [ isCopied, setCopied ] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(
        window.location.protocol + '//' + window.location.host + url
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const Anchor = inline ? PermaLinkAnchorInline : PermaLinkAnchor;

  return (
    <Anchor
      to={url}
      level={level}
      onClick={copyLink}
    >
      <StyledLinkIcon level={level} inline={inline ? 1 : 0} />
      <Tooltip>
        {!isCopied && <StyledMouseIcon/>}
        {isCopied ? 'copied' : 'copy link'}
      </Tooltip>
    </Anchor>
  );
};

export default PermaLink;
