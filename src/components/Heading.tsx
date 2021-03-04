import React, { FunctionComponent, useContext } from 'react';
import BlogContext from './BlogContext';
import PermaLink from './PermaLink';

interface IHeadingProps {
    level?: number
};

export const Heading: FunctionComponent<IHeadingProps> = ({
    level,
    children
}) => {
    const { url } = useContext(BlogContext);
    const HeadingElement: any = `h${level || 1}`;

    return (
        <HeadingElement>
            <PermaLink url={url} />
            {children}
        </HeadingElement>
    );
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
