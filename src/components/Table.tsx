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

import React, { FC } from 'react';
import styled from 'styled-components'

export const Table: FC = styled.table`
  font-size: ${props => props.theme.normalFontSize};
  border-spacing: 0;
`

export const TableHeading: FC = styled.th`
  padding: ${props => props.theme.spacingHalf};
  text-align: left;
`

export const TableRow: FC = styled.tr`
  height: ${props => props.theme.spacingDouble};

  &:hover td {
      background: ${props => props.theme.isDark
  ? props.theme.foregroundColor + '20'
  : props.theme.accentLightColor};
  }

  &:last-of-type td {
      border: none;
  }
`

export const TableCell: FC = styled.td`
  padding: ${props => props.theme.spacingHalf};
  border-bottom: 1px solid ${props => props.theme.borderColor};
  transition: background-color ${props => props.theme.animationFast} ease-in-out;
`
