import styled from 'styled-components';

const PrimaryButton = styled.button`
  border: none;
  cursor: pointer;
  padding: 4px;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  font-family: ${props => props.theme.smallFont};
  font-size: ${props => props.theme.smallFontSize};
  font-weight: ${props => props.theme.smallFontWeight};
`;

export default PrimaryButton;
