import styled from 'styled-components';

const ExternalMetaLink = styled.a`
  border-bottom-width: ${(props) => props.theme.border};
  border-bottom-style: dotted;
  border-bottom-color: ${(props) =>
    props.theme.isDark
      ? props.theme.primaryAccentColor
      : props.theme.accentTextColor};
  text-decoration: none;
  white-space: nowrap;

  color: ${(props) =>
    props.highlight
      ? props.theme.focusColor
      : props.theme.isDark
      ? props.theme.primaryAccentColor
      : props.theme.accentTextColor};

  transition: color ${(props) => props.theme.animationFast} ease-out,
    border-bottom-color ${(props) => props.theme.animationFast} ease-out;

  &:hover {
    border-bottom-color: ${(props) =>
      props.theme.isDark
        ? props.theme.primaryColor
        : props.theme.primaryDarkColor};
    text-decoration: none;
  }
`;

export default ExternalMetaLink;
