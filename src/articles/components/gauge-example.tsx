import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Controls, Control } from './controls';

const Gauge: FC<{ position: number }> = ({ position }) => (
  <svg width="128" viewBox="0 0 64 48">
    <g
      className="stroke-border fill-none"
      strokeLinecap="round"
      strokeMiterlimit="10"
    >
      <line x1="18.7" y1="38.6" x2="12.3" y2="36.5" />
      <line x1="22.8" y1="30.5" x2="17.4" y2="26.6" />
      <line x1="29.2" y1="24.1" x2="25.3" y2="18.7" />
      <line x1="37.3" y1="20" x2="35.2" y2="13.6" />
      <path d="M0.9,47.5h16.4c0-16,13-29,29-29V2.2C21.2,2.2,0.9,22.5,0.9,47.5z" />
    </g>
    <polygon
      id="arrow"
      className="fill-foreground"
      style={{
        transformOrigin: '45.634px 47.543px',
        transform: `rotate(${position * 90}deg)`,
        transition: 'transform 0.3s ease-in-out',
      }}
      points="28,46.3 -2.3,46.3 -2.3,47.5 28.3,47.5 33.4,47.5 45.6,47.5 45.6,42.5 32.1,42.5 "
    />
  </svg>
);

const Example = styled.section`
  margin-left: ${(props) => props.theme.spacingHalf};
`;

const GaugeExample: FC = () => {
  const [position, setPosition] = useState(0);
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
            onChange={(e) => setPosition(e.target.valueAsNumber)}
          />
          {position}
        </Control>
      </Controls>
      <Gauge position={position} />
    </Example>
  );
};

export default GaugeExample;
