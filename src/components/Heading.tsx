import React, { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import BlogContext from './BlogContext';
import PermaLink from './PermaLink';
import slugify from 'slugify';

const HeadingAnchorLink = styled(AnchorLink)`
    color: ${props => props.theme.foregroundColor};
`;

interface IHeadingProps {
    level?: number
};

export const Heading: FunctionComponent<IHeadingProps> = ({
    level = 1,
    children
}) => {
    const { url } = useContext(BlogContext);
    const HeadingElement: any = `h${level}`;
    
    if (level === 1) {
        return (
            <HeadingElement>
                <PermaLink url={url} />
                {children}
            </HeadingElement>
        );
    } else {
        const slug = slugify(children.toString().toLowerCase());
        const urlWithAnchor = url + '#' + slug;

        return (
            <HeadingElement id={slug}>
                <PermaLink url={urlWithAnchor} />
                <HeadingAnchorLink to={urlWithAnchor} title={slug}>
                    {children}
                </HeadingAnchorLink>
            </HeadingElement>
        );
    }
};

export const Heading1: FunctionComponent = ({ children }) => (
    <Heading level={1}>{children}</Heading>
);

export const Heading2: FunctionComponent = ({ children }) => (
    <Heading level={2}>{children}</Heading>
);

export const Heading3: FunctionComponent = ({ children }) => (
    <Heading level={3}>{children}</Heading>
);

export const Heading4: FunctionComponent = ({ children }) => (
    <Heading level={4}>{children}</Heading>
);
