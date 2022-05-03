import styled from 'styled-components';

export const Definition = styled.dl`
  display: flex;
  padding-bottom: ${(props) => props.theme.spacingQuarter};
  border-bottom: ${(props) => props.theme.border} dotted
    ${(props) => props.theme.borderColor};
`;

export const Property = styled.dd<{ secondary: boolean }>`
  flex: 1;
  margin-left: 0;
  ${(props) => props.secondary && `color: ${props.theme.secondaryTextColor}`};
`;

export const Value = styled.dt`
  font-weight: 600;
`;
