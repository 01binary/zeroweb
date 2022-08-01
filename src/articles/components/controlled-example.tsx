import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Controls, Control } from './controls';

const FRAMES = 14;

const showFrame = (pos: number, frame: number) =>
  Math.round(pos * FRAMES) === frame ? 1 : 0;

const Cube: FC<{
  position: number;
}> = ({ position }) => (
  <svg width="128" viewBox="0 0 32 32">
    <g className="fill-none stroke-foreground" strokeWidth="0.5">
      <g id="frame1" style={{ opacity: showFrame(position, 0) }}>
        <polygon points="29.77,24.85 15.77,31.35 1.77,24.85 1.77,7.61 15.77,1.11 29.77,7.61 	" />
        <polyline points="1.77,7.61 15.77,14.1 29.77,7.61 	" />
        <line x1="15.77" y1="14.1" x2="15.77" y2="31.35" />
      </g>
      <g id="frame2" style={{ opacity: showFrame(position, 1) }}>
        <polygon points="29.77,23.85 17.77,31.35 1.77,25.85 1.77,8.11 14.77,1.11 29.77,6.61 	" />
        <polyline points="1.77,8.11 17.77,14.1 29.77,6.61 	" />
        <line x1="17.77" y1="14.1" x2="17.77" y2="31.35" />
      </g>
      <g id="frame3" style={{ opacity: showFrame(position, 2) }}>
        <polygon points="29.77,23.85 18.77,31.35 2.27,25.85 2.27,8.61 12.77,1.11 29.77,5.61 	" />
        <polyline points="2.27,8.61 18.77,13.1 29.77,5.61 	" />
        <line x1="18.77" y1="13.1" x2="18.77" y2="31.35" />
      </g>
      <g id="frame4" style={{ opacity: showFrame(position, 3) }}>
        <polygon points="29.27,22.85 19.77,31.35 2.27,26.35 2.27,9.61 11.77,1.11 29.27,5.11 	" />
        <polyline points="2.27,9.61 19.77,13.1 29.27,5.11 	" />
        <line x1="19.77" y1="13.1" x2="19.77" y2="31.35" />
      </g>
      <g id="frame5" style={{ opacity: showFrame(position, 4) }}>
        <polygon points="28.77,22.85 21.77,30.85 3.27,27.35 3.27,9.61 10.27,1.61 28.77,4.61 	" />
        <polyline points="3.27,9.61 21.77,13.1 28.77,4.61 	" />
        <line x1="21.77" y1="13.1" x2="21.77" y2="30.85" />
      </g>
      <g id="frame6" style={{ opacity: showFrame(position, 5) }}>
        <polygon points="28.27,22.85 23.27,30.35 3.27,28.35 3.27,10.61 8.77,2.11 28.27,3.61 	" />
        <polyline points="3.27,10.61 23.27,12.6 28.27,3.61 	" />
        <line x1="23.27" y1="12.6" x2="23.27" y2="30.35" />
      </g>
      <g id="frame7" style={{ opacity: showFrame(position, 6) }}>
        <polygon points="27.27,22.85 24.27,30.35 4.27,28.85 4.27,11.11 7.77,2.11 27.27,3.61 	" />
        <polyline points="4.27,11.11 24.27,12.6 27.27,3.61 	" />
        <line x1="24.27" y1="12.6" x2="24.27" y2="30.35" />
      </g>
      <g id="frame8" style={{ opacity: showFrame(position, 7) }}>
        <polygon points="26.27,22.85 24.77,29.85 5.27,29.35 5.27,11.11 6.27,2.61 26.27,3.11 	" />
        <polyline points="5.27,11.11 24.77,12.1 26.27,3.11 	" />
        <line x1="24.77" y1="12.1" x2="24.77" y2="29.85" />
      </g>
      <g id="frame9" style={{ opacity: showFrame(position, 8) }}>
        <polygon points="26.49,11.48 26.27,29.85 6.27,29.35 6.27,11.11 5.27,2.61 25.77,2.61 	" />
        <polyline points="6.27,11.48 26.49,11.48 25.77,2.61 	" />
        <polyline points="5.27,2.61 5.27,20.35 6.27,29.35 	" />
      </g>
      <g id="frame10" style={{ opacity: showFrame(position, 9) }}>
        <polygon points="27.49,11.48 27.27,28.85 7.27,30.35 7.27,11.61 4.27,3.11 24.27,2.11 	" />
        <polyline points="7.27,11.98 27.49,11.48 24.27,2.11 	" />
        <polyline points="4.27,3.11 4.27,20.85 7.27,30.35 	" />
      </g>
      <g id="frame11" style={{ opacity: showFrame(position, 10) }}>
        <polygon points="28.49,10.98 28.27,28.35 9.27,30.35 9.27,12.61 3.77,4.11 23.27,2.11 	" />
        <polyline points="9.27,12.61 28.49,10.98 23.27,2.11 	" />
        <polyline points="3.77,4.11 3.77,21.85 9.27,30.35 	" />
      </g>
      <g id="frame12" style={{ opacity: showFrame(position, 11) }}>
        <polygon points="28.49,9.98 28.27,28.35 10.27,30.85 10.27,12.61 3.27,4.11 21.77,1.61 	" />
        <polyline points="10.27,12.61 28.49,9.98 21.77,1.61 	" />
        <polyline points="3.27,4.11 3.27,21.85 10.27,30.85 	" />
      </g>
      <g id="frame13" style={{ opacity: showFrame(position, 12) }}>
        <polygon points="29.49,9.98 29.27,27.35 11.27,30.85 11.27,12.61 2.27,5.11 20.27,1.61 	" />
        <polyline points="11.27,12.61 29.49,9.98 20.27,1.61 	" />
        <polyline points="2.27,5.11 2.27,22.85 11.27,30.85 	" />
      </g>
      <g id="frame14" style={{ opacity: showFrame(position, 13) }}>
        <polygon points="29.49,8.48 29.27,26.35 12.77,31.35 12.77,12.61 2.27,5.61 18.77,1.11 	" />
        <polyline points="12.77,12.61 29.49,8.48 18.77,1.11 	" />
        <polyline points="2.27,5.61 2.27,23.35 12.77,31.35 	" />
      </g>
      <g id="frame15" style={{ opacity: showFrame(position, 14) }}>
        <polygon points="29.99,8.48 29.77,26.35 14.27,31.35 14.27,12.61 2.27,6.11 17.77,1.11 	" />
        <polyline points="14.27,12.61 29.99,8.48 17.77,1.11 	" />
        <polyline points="2.27,6.11 2.27,24.85 14.27,31.35 	" />
      </g>
    </g>
  </svg>
);

const Example = styled.section`
  margin-top: ${(props) => props.theme.spacingHalf};
  margin-left: ${(props) => props.theme.spacingHalf};
`;

const ControlledAnimationExample: FC = () => {
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
      <Cube position={position} />
    </Example>
  );
};

export default ControlledAnimationExample;
