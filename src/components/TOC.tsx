import React, { FunctionComponent, useContext } from 'react';
import { AnchorLink } from 'gatsby-plugin-anchor-links';
import styled from 'styled-components';
import useActiveHeading from '../hooks/useActiveHeading';
import IHeading from '../models/IHeading';

const Toc = styled.section`
    font-family: ${props => props.theme.smallFont};
    font-size: ${props => props.theme.smallFontSize};
    font-weight: ${props => props.theme.smallFontWeight};
    line-height: ${props => props.theme.smallFontLineHeight};
    list-style-type: none;
    margin-top: ${props => props.theme.spacing};
`;

const TocTitle = styled.h2`
    margin-left: 0 !important;
    @media(max-width: ${props => props.theme.mobile}) {
        position: relative;
        margin-top: -0.25em !important;
    }
`;

const TocList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const TocItem = styled.li`
    margin-left: ${props => props.depth * props.theme.spacingQuarter};
`;

const TocItemLink = styled(AnchorLink)`
    @media(min-width: ${props => props.theme.mobile}) {
        ${props => props.active && `
            text-decoration: underline;
        `}
    }
`;

interface ITOCProps {
    headings: Array<IHeading>
};

const TOC: FunctionComponent<ITOCProps> = ({
    headings
}) => {
    if (headings.length === 0)
        return null;

    const active = useActiveHeading(headings);

    return (
        <Toc>
            <TocTitle>Contents</TocTitle>
            <TocList>
                {headings.map(({ value, url, slug, depth }) => (
                    <TocItem key={url} depth={depth - 2}>
                        <TocItemLink
                            to={url}
                            active={slug === active}
                        >
                            {value}
                        </TocItemLink>
                    </TocItem>
                ))}
            </TocList>
        </Toc>
    );
};

export default TOC;
