import React, { FunctionComponent, useContext } from 'react';
import { AnchorLink } from 'gatsby-plugin-anchor-links';
import styled from 'styled-components';
import BlogContext from './BlogContext';
import slugify from 'slugify';
import IHeading from '../models/IHeading';

const Toc = styled.section`
    font-family: ${props => props.theme.smallFont};
    font-size: ${props => props.theme.smallFontSize};
    font-weight: ${props => props.theme.smallFontWeight};
    line-height: ${props => props.theme.smallFontLineHeight};
    list-style-type: none;

    position: relative;
    padding: 0;

    @media (max-width: ${props => props.theme.wide}) {
        position: absolute;
        max-width: 20%;
        right: 0;
        top: 0;
    }
`;

const TocList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const TocItem = styled.li`
    .depth-1 {
        margin-left: ${props => props.theme.spacingQuarter};
    }

    .depth-2 {
        margin-left: ${props => props.theme.spacingHalf};
    }
`;

interface ITOCProps {
    headings: Array<IHeading>
};

const TOC: FunctionComponent<ITOCProps> = ({
    headings
}) => {
    const { url } = useContext(BlogContext);
    return (
        <Toc>
            <h2>Contents</h2>
            <TocList>
                {headings.map(({ value, depth }) => {
                    const slug = slugify(value, { lower: true });
                    return (
                        <TocItem key={slug}>
                            <AnchorLink to={`${url}#${slug}`} className={`depth-${depth - 2}`}>
                                {value}
                            </AnchorLink>
                        </TocItem>
                    );
                })}
            </TocList>
        </Toc>
    );
};

export default TOC;
