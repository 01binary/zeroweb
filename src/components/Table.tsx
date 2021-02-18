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
        background: ${props => props.theme.shadowColor};
    }

    &:last-of-type td {
        border: none;
    }
`

export const TableCell: FunctionComponent = styled.td`
    padding: ${props => props.theme.spacingHalf};
    borderBottom: ${props => props.theme.border} solid ${props => props.theme.borderColor};
    transition: background-color .3s ease-in-out;
`
