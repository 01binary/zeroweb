import React, { FC } from 'react';
import styled from 'styled-components';
import ROUTES from '../routes';

const NAVLINK_WIDTH = 110;
const NAVLINK_HEIGHT = 50;
const BRACKET_OFFSET = 16;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 20;
const BULLET_TOP = Math.ceil(NAVLINK_HEIGHT / 2 - NAVLINK_HEIGHT * 0.1);
const CALLOUT_TOP = Math.ceil(BULLET_TOP / 2) + 0.5;

interface CalloutProps {
    offset: number;
    className?: string;
};

const getGeometry = (
    points: Array<Array<number>>
): string => points
    .reduce((acc, cur, index) => 
        acc +
            (index ? ' L ' : '') +
            cur[0] + ' ' + cur[1]
    , 'M ');

const Callout: FC<CalloutProps> = ({
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
    margin-bottom: -8px;
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
    margin-top: calc(-1em - 8px);
    margin-left: ${props => props.theme.spacingHalf};

    animation: slideIn ${props => props.theme.animationSlow} ease-out 1;

    @keyframes slideIn {
        0% {
            opacity: 0;
            transform: translateY(8px);
        }

        100% {
            opacity: 1;
            transform: translateY(0px);
        }
    }

    @media (max-width: ${props => props.theme.mobile}) {
        font-size: ${props => props.theme.headingFontSizeLargest} !important;
        margin-top: 0;
        margin-left: ${props => props.theme.spacingHalf};
    }
`;

interface TitleProps {
    collection: string;
};

const Title: FC<TitleProps> = ({
    collection,
    children
}) => (
    <div>
        <Decorator offset={
            NAVLINK_WIDTH *
            (ROUTES.findIndex(
                ({ collection: routeCollection}) => routeCollection === collection
            ) + 1) - BRACKET_OFFSET
        } />
        <Heading>{children}</Heading>
    </div>
);

export default Title;
