import React, { FC } from 'react';
import styled from 'styled-components';
import Cell from '../images/cell.svg';
import ShareIcon from '../images/share.svg';
import CommentIcon from '../images/comment.svg';
import SnapIcon from '../images/snap.svg';

const WHEEL_SIZE = 76;
const CELL_WIDTH = 44;
const CELL_HEIGHT = 38;
const ICON_SIZE = 36;

const StyledCell = styled(Cell)`
    position: absolute;
    left: 0;
    top: 0;
    width: ${CELL_WIDTH}px;
    height: ${CELL_HEIGHT}px;
`;

const StyledShareIcon = styled(ShareIcon).attrs(() => ({
    className: 'wheel-icon'
}))``;

const StyledCommentIcon = styled(CommentIcon).attrs(() => ({
    className: 'wheel-icon'
}))``;

const StyledSnapIcon = styled(SnapIcon)`
    position: relative;
    left: -4px;
    #frame1 {
        opacity: 0;
        animation: snapFrame1 .6s steps(1) infinite;
    }

    #frame2 {
        opacity: 0;
        animation: snapFrame2 .6s steps(1) infinite;
    }
    
    #frame3 {
        opacity: 0;
        animation: snapFrame3 .6s steps(1) infinite;
    }

    #frame4 {
        opacity: 0;
        animation: snapFrame4 .6s steps(1) infinite;
    }

    @keyframes snapFrame1 {
        0% { opacity: 1; }
        25% { opacity: 0; }
    }

    @keyframes snapFrame2 {
        25% { opacity: 1; }
        50% { opacity: 0; }
    }

    @keyframes snapFrame3 {
        50% { opacity: 1; }
        75% { opacity: 0; }
    }

    @keyframes snapFrame4 {
        75% { opacity: 1; }
        100% { opacity: 0; }
    }
`;

const WheelWrapper = styled.div`
    position: relative;
    width: ${WHEEL_SIZE}px;
    height: ${WHEEL_SIZE}px;
`;

const WheelButton = styled.button`
    background: none;
    border: none;
    appearance: none;
    cursor: pointer;

    position: absolute;
    width: ${CELL_WIDTH}px;
    height: ${CELL_HEIGHT}px;

    &:focus {
        outline: none;

        z-index: 1;

        .stroke-border {
            stroke: ${props => props.theme.focusColor};
        }
    }

    .wheel-icon {
        position: absolute;
        left: ${(CELL_WIDTH - ICON_SIZE) / 2}px;
        top: ${(CELL_HEIGHT - ICON_SIZE) / 2}px;
    }
`;

const SnapButton = styled(WheelButton)`
    left: 0px;
    top: 37px;
`;

const ShareButton = styled(WheelButton)`
    left: 0px;
    top: 0px;
`;

const CommentButton = styled(WheelButton)`
    left: 32px;
    top: 18.5px;
`;

const Wheel: FC = () => (
    <WheelWrapper>
        <SnapButton>
            <StyledCell />
            <StyledSnapIcon />
        </SnapButton>
        <ShareButton>
            <StyledCell />
            <StyledShareIcon />
        </ShareButton>
        <CommentButton>
            <StyledCell />
            <StyledCommentIcon />
        </CommentButton>
    </WheelWrapper>
);

export default Wheel;
