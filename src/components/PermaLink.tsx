import React, { FunctionComponent, useState } from "react"
import styled from 'styled-components';
import { Link } from "gatsby";

const PermaLinkAnchor = styled(Link)`
  position: relative;
  opacity: 0;
  color: ${props => props.theme.secondaryTextColor};
  transition: opacity ${props => props.theme.animationFast} ease-out;
  margin-right: .25em;
  margin-left: -.25em;
  z-index: 6;

  &:hover div {
    opacity: .8;
    transform: translateY(0);
  }
`;

const Tooltip = styled.div`
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
  color: ${props => props.theme.primaryTextColor};
  position: absolute;
	line-height: ${props => props.theme.spacing};
	background: ${props => props.theme.dropShadowTransparentColor};
	padding: ${props => props.theme.spacingQuarter} ${props => props.theme.spacingHalf};
	bottom: calc(100% + .6em);
  width: 5em;
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
      #
      <Tooltip>
        {isCopied ? 'copied' : 'copy link'}
      </Tooltip>
    </PermaLinkAnchor>
  );
};

export default PermaLink;
