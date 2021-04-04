import React, { FunctionComponent } from 'react';
import styled from 'styled-components'

export const Table: FunctionComponent = styled.table`
    font-size: ${props => props.theme.normalFontSize};
    border-spacing: 0;
`

export const TableHeading: FunctionComponent = styled.th`
    padding: ${props => props.theme.spacingHalf};
    text-align: left;
`

export const TableRow: FunctionComponent = styled.tr`
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

export const TableCell: FunctionComponent = styled.td`
    padding: ${props => props.theme.spacingHalf};
    border-bottom: 1px solid ${props => props.theme.borderColor};
    transition: background-color ${props => props.theme.animationFast} ease-in-out;
`
