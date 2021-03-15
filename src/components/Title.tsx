import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const NAVLINK_WIDTH = 110;
const NAVLINK_HEIGHT = 50;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 20;
const BULLET_TOP = Math.ceil(NAVLINK_HEIGHT / 2 - NAVLINK_HEIGHT * 0.1);
const CALLOUT_TOP = Math.ceil(BULLET_TOP / 2) + 0.5;
const COLLECTION_OFFSETS = [ "articles", "projects", "about" ];

interface ICalloutProps {
    offset: number,
    className?: string
};

const getGeometry = (
    points: Array<Array<number>>
): string => points
    .reduce((acc, cur, index) => 
        acc +
            (index ? ' L ' : '') +
            cur[0] + ' ' + cur[1]
    , 'M ');

const Callout: React.FunctionComponent<ICalloutProps> = ({
    offset,
    className
}) => (
    <svg
        className={className}
        width={offset}
        height={NAVLINK_HEIGHT}
    >
        <path d={getGeometry([
            [ 0, BULLET_TOP ],
            [ 0, BULLET_TOP + BULLET_HEIGHT ],
            [ BULLET_WIDTH, BULLET_TOP + BULLET_HEIGHT ],
            [ BULLET_WIDTH, BULLET_TOP + 3 ]]) + 'z'}
            className="title-bullet"
        />
        <path d={getGeometry([
            [ 0.5, BULLET_TOP + 1 ],
            [ 0.5, CALLOUT_TOP ],
            [ offset - BULLET_TOP / 2, CALLOUT_TOP ],
            [ offset - 1, 0 ]])}
            className="title-callout"
        />
    </svg>
);

const Decorator = styled(Callout)`
    margin-bottom:-8px;
    margin-right: -${props => props.offset - 16}px;

    .title-bullet {
        fill: ${props => props.theme.primaryColor};
        stroke: none;
    }

    .title-callout {
        fill: none;
        stroke: ${props => props.theme.primaryColor};
    }

    @media (max-width: ${props => props.theme.mobile}) {
        display: none;
    }
`;

const Heading = styled.h1`
    margin-top: 0;

    @media (max-width: ${props => props.theme.mobile}) {
        margin-left: ${props => props.theme.spacingHalf};
    }
`;

interface ITitleProps {
    collection: string
};

const Title: FunctionComponent<ITitleProps> = ({
    collection,
    children
}) => (
    <Heading>
        <Decorator offset={NAVLINK_WIDTH * (COLLECTION_OFFSETS.indexOf(collection) + 1)} />
        {children}
    </Heading>
);

export default Title;
