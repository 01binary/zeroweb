import styled from 'styled-components';
import { Link } from "gatsby";

const MetaLink = styled(Link)`
  border-bottom-width: ${props => props.theme.border};
  border-bottom-style: dotted;
  border-bottom-color: ${props => props.theme.isDark
    ? props.theme.primaryAccentColor
    : props.theme.accentTextColor
  };
  text-decoration: none;
  white-space: nowrap;

  transition:
    color ${props => props.theme.animationFast} ease-out,
    border-bottom-color ${props => props.theme.animationFast} ease-out;

  &:hover {
    border-bottom-color: ${props => props.theme.isDark
      ? props.theme.primaryColor
      : props.theme.primaryDarkColor
    };
    text-decoration: none;
  }
`;

export default MetaLink;
