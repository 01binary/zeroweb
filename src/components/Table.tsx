/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Table component used in markdown (MDX) to render tables.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import styled from 'styled-components';
import { RULER_OFFSET } from './Ruler';

export const Table = styled.table`
  font-size: ${(props) => props.theme.normalFontSize};
  border-spacing: 0;

  position: relative;
  width: calc(100% - ${(props) => props.theme.spacing});
  margin-bottom: ${(props) => props.theme.spacingHalf};
  margin-left: ${(props) => props.theme.spacingHalf};
  border-collapse: collapse;

  &:after {
    content: '';
    position: absolute;
    left: calc(
      100% + ${(props) => props.theme.spacing} + ${RULER_OFFSET}px +
        ${(props) => props.theme.border}
    );
    top: 0;
    width: calc(${(props) => props.theme.border} * 1.5);
    height: 100%;
    background: ${(props) => props.theme.foregroundColor};
    opacity: 0.4;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
  }

  &:hover {
    &:after {
      opacity: 1;
    }
  }

  th:first-of-type,
  td:first-of-type {
    padding-left: 0;
  }

  th:first-of-type,
  td:last-of-type {
    padding-right: 0;
  }

  @media (max-width: ${(props) => props.theme.wide}) {
    &:after {
      display: none;
    }
  }
`;

export const TableHeading = styled.th`
  padding: ${(props) => props.theme.spacingHalf};
  text-align: left;
`;

export const TableRow = styled.tr`
  height: ${(props) => props.theme.spacingDouble};

  &:last-of-type td {
    border: none;
  }
`;

export const TableCell = styled.td`
  padding: ${(props) => props.theme.spacingHalf};
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  transition: background-color ${(props) => props.theme.animationFast}
    ease-in-out;
`;
