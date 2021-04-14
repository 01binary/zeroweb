import React, { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import BlogContext from './BlogContext';
import PermaLink from './PermaLink';
import slugify from 'slugify';

const HeadingWrapper = styled.div`
    position: relative;
    margin: 0;
    padding: 0;

    .permalink-icon {
        transition: opacity ${props => props.theme.animationFast} ease-out;
        opacity: 0;
    }

    &:hover {
        .permalink-icon {
            opacity: 1;
        }
    }
`;

const HeadingText = styled.span`
    margin-right: 0.33em;
`;

interface HeadingProps {
    level?: number;
};

export const Heading: FunctionComponent<HeadingProps> = ({
    level = 1,
    children
}) => {
    const { url } = useContext(BlogContext);
    const HeadingElement: any = `h${level}`;
    
    if (level === 1) {
        return (
            <HeadingWrapper>
                <PermaLink url={url} level={level} />
                <HeadingElement>
                    <HeadingText>{children}</HeadingText>
                    <PermaLink url={url} level={level} inline />
                </HeadingElement>
            </HeadingWrapper>
        );
    } else {
        const slug = slugify(children.toString(), { lower: true });
        const urlWithAnchor = url + '#' + slug;

        return (
            <HeadingWrapper>
                <PermaLink url={urlWithAnchor} level={level} />
                <HeadingElement id={slug}>
                    <HeadingText>{children}</HeadingText>
                    <PermaLink url={url} level={level} inline />
                </HeadingElement>
            </HeadingWrapper>
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
