import React, { FunctionComponent, useContext } from 'react';
import { AnchorLink } from 'gatsby-plugin-anchor-links';
import styled from 'styled-components';
import BlogContext from './BlogContext';
import slugify from 'slugify';
import IHeading from '../models/IHeading';

interface ITOCProps {
    headings: Array<IHeading>
};

const TOC: FunctionComponent<ITOCProps> = ({
    headings
}) => {
    const { url } = useContext(BlogContext);
    return (
        <section>
            <h2>Contents</h2>
            <ul>
                {headings.map(({ value, depth }) => {
                    const slug = slugify(value, { lower: true });
                    return (
                        <li key={slug} style={{marginLeft: `${(depth - 1) * 10}px`}}>
                            <AnchorLink to={`${url}#${slug}`}>
                                {value}
                            </AnchorLink>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default TOC;
