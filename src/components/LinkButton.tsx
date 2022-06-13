import styled from 'styled-components';

const LinkButton = styled.button`
  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};

  padding: ${(props) => props.theme.spacingQuarter};

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  transition: color ${(props) => props.theme.animationFast} ease-out;

  color: ${(props) =>
    props.theme.isDark
      ? props.theme.primaryColor
      : props.theme.accentTextColor};

  &:focus {
    border-radius: ${(props) => props.theme.borderRadius};
    box-shadow: 0 0 0 ${(props) => props.theme.border}
      ${(props) => props.theme.focusColor};
    outline: none;
  }

  &:hover {
    text-decoration: underline;
    color: ${(props) =>
      props.theme.isDark
        ? props.theme.primaryLightColor
        : props.theme.primaryDarkColor};
  }
`;

export default LinkButton;
