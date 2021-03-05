import React, { FunctionComponent, useContext } from 'react';
import BlogContext from './BlogContext';
import PermaLink from './PermaLink';
import slugify from 'slugify';

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
        const slug = slugify(children.toString(), { lower: true });
        const urlWithAnchor = url + '#' + slug;

        return (
            <HeadingElement id={slug}>
                <PermaLink url={urlWithAnchor} />
                {children}
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
