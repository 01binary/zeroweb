import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Controls, Control } from './controls';

const TapePlayer: FC<{ position: number; forward: boolean }> = ({
  position,
  forward,
}) => (
  <svg width="200" viewBox="0 0 135 64">
    <g className="fill-none stroke-border">
      <line x1="42.3" y1="7.4" x2="43.5" y2="7.5" />
      <line x1="98.7" y1="12.3" x2="99.9" y2="12.4" />
      <circle cx="27.2" cy="26.8" r="3.2" />
      <circle cx="107.4" cy="27.4" r="3.2" />
    </g>

    <g
      id="tape"
      className="fill-none stroke-border"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="2.4822,3.3096"
      strokeDashoffset={`${(1 - position) * 10}px`}
      style={{ transition: 'stroke-dashoffset .5s ease-in-out' }}
    >
      <line x1="46.8" y1="7.8" x2="97.1" y2="12.2" />
      <line x2="21.1" y2="50.6" x1="31.8" y1="61.3" />
      <polyline points="93.2,62.2 69.7,54.2 66.2,54.2 62.8,54.2 35.1,62.2 " />
      <line x1="121.1" y1="36.8" x2="96.5" y2="61.3" />
    </g>
    <circle className="fill-border" cx="27.2" cy="26.8" r="1.4" />
    <circle className="fill-border" cx="107.4" cy="27.4" r="1.4" />

    <g
      id="reel-outer"
      className="fill-none stroke-foreground"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <circle cx="27.2" cy="26.8" r="24.6" />
      <circle cx="107.4" cy="27.4" r="24.6" />
    </g>
    <g
      id="wheels"
      className="fill-none stroke-border"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <circle cx="33.7" cy="60.8" r="2.1" />
      <circle cx="94.7" cy="60.8" r="2.1" />
    </g>
    <polygon
      className="fill-foreground"
      points="66.2,61.6 70.6,61.6 70.6,57.8 67.8,54.9 66.2,54.9 64.7,54.9 61.8,57.8 61.8,61.6 "
    />
    <g
      id="chevrons"
      className="fill-foreground"
      style={
        forward ? {} : { transform: 'scaleX(-1)', transformOrigin: '67px' }
      }
    >
      <polygon points="58,29.4 60,29.4 62.2,26.3 60,23.2 58,23.2 60.1,26.3 " />
      <polygon points="62.8,29.4 64.8,29.4 67,26.3 64.8,23.2 62.8,23.2 64.9,26.3 " />
      <polygon points="67.6,29.5 69.6,29.5 71.8,26.4 69.6,23.3 67.6,23.3 69.8,26.4 " />
      <polygon points="72.4,29.5 74.5,29.5 76.6,26.4 74.5,23.3 72.4,23.3 74.6,26.4 " />
    </g>
    <g
      id="reel2"
      className="fill-none stroke-border"
      style={{
        transform: `rotate(${position * 360}deg)`,
        transformOrigin: '107.4px 27.4px',
        transition: 'transform .5s ease-in-out',
      }}
    >
      <circle
        strokeWidth="3.5"
        strokeLinejoin="round"
        cx="107.4"
        cy="27.4"
        r="16.7"
      />
      <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="122.1" y1="35.4" x2="113.7" y2="30.5" />
        <line x1="92.8" y1="35.4" x2="101.2" y2="30.5" />
        <line x1="107.4" y1="10.6" x2="107.4" y2="20.2" />
      </g>
    </g>
    <g
      id="reel1"
      className="fill-none stroke-border"
      style={{
        transform: `rotate(${position * 360}deg)`,
        transformOrigin: '27.2px 26.8px',
        transition: 'transform .5s ease-in-out',
      }}
    >
      <circle
        strokeWidth="3.5"
        strokeLinejoin="round"
        cx="27.2"
        cy="26.8"
        r="21.4"
      />
      <g strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="27.2" y1="10.8" x2="27.2" y2="20.2" />
        <line x1="40.7" y1="34.2" x2="33.1" y2="29.8" />
        <line x1="13.7" y1="34.2" x2="21.3" y2="29.6" />
      </g>
    </g>
  </svg>
);

const Example = styled.section`
  margin-top: ${(props) => props.theme.spacing};
  margin-left: ${(props) => props.theme.spacingHalf};
  margin-bottom: ${(props) => props.theme.spacing};
`;

const TapeExample: FC = () => {
  const [position, setPosition] = useState(0);
  const [delta, setDelta] = useState(1);

  const handleSeek = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.valueAsNumber;
    setPosition((prevPosition) => {
      setDelta(value - prevPosition);
      return value;
    });
  }, []);

  return (
    <Example>
      <Controls>
        <Control>
          position
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.01"
            value={position}
            onChange={handleSeek}
          />
          {delta < 0 ? '-' : '+'} {position}
        </Control>
      </Controls>
      <TapePlayer position={position} forward={delta >= 0} />
    </Example>
  );
};

export default TapeExample;
