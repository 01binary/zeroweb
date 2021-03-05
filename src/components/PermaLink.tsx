import React, { FunctionComponent, useState } from "react"
import styled from 'styled-components';
import { Link } from 'gatsby';
import LinkIcon from '../images/link.svg';
import MouseIcon from '../images/mouse.svg'

const Tooltip = styled.div`
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
    z-index: 9000;
    border-width: 6px;
    border-style: solid;
    border-color:
      ${props => props.theme.dropShadowTransparentColor}
      transparent
      transparent
      ${props => props.theme.dropShadowTransparentColor};
  }

  .stroke-foreground {
    stroke: ${props => props.theme.backgroundColor};
  }

  .stroke-background {
    stroke: ${props => props.theme.borderColor}
  }
`;

const PermaLinkAnchor = styled(Link)`
  position: relative;
  opacity: 0;
  color: ${props => props.theme.secondaryTextColor};
  transition: opacity ${props => props.theme.animationFast} ease-out;
  margin-right: .25em;
  margin-left: calc(-1em + 3px);
  z-index: 6;

  &:hover div {
    opacity: .8;
    transform: translateY(0);
  }
`;

const StyledLinkIcon = styled(LinkIcon)`
  width: 1.3em;
  height: 1.3em;
  position: relative;
  top: .35em;

  .fill-foreground {
    fill: ${props => props.theme.secondaryTextColor};
  }
`;

const StyledMouseIcon = styled(MouseIcon)`
  position: relative;
  width: 1.3em;
  height: 1.3em;
  top: ${props => props.theme.spacingMin};
  margin-right: ${props => props.theme.spacingQuarter};
`;

interface PermaLinkProps {
    url: string
}

const PermaLink: FunctionComponent<PermaLinkProps> = ({
    url
}) => {
  const [ isCopied, setCopied ] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(
        window.location.protocol + '//' + window.location.host + url
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <PermaLinkAnchor to={url} onClick={copyLink}>
      <StyledLinkIcon />
      <Tooltip>
        {!isCopied && <StyledMouseIcon/>}
        {isCopied ? 'copied' : 'copy link'}
      </Tooltip>
    </PermaLinkAnchor>
  );
};

export default PermaLink;
