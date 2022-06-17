import styled from 'styled-components';
import { MOBILE } from '../../constants';
import RotatingCube from '../../images/cube.svg';

const FRAMES = 15;

const showFrame = (pos: number, frame: number) =>
  Math.round(pos * FRAMES) === frame ? 1 : 0;

const CubeAnimation = styled(RotatingCube)<{
  position: number;
}>`
  position: absolute;
  left: -26px;
  top: 2px;

  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;

  // Fix Safari flicker by forcing a 3D layer
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;

  #frame1 {
    opacity: ${({ position }) => showFrame(position, 0)};
  }

  #frame2 {
    opacity: ${({ position }) => showFrame(position, 1)};
  }

  #frame3 {
    opacity: ${({ position }) => showFrame(position, 2)};
  }

  #frame4 {
    opacity: ${({ position }) => showFrame(position, 3)};
  }

  #frame5 {
    opacity: ${({ position }) => showFrame(position, 4)};
  }

  #frame6 {
    opacity: ${({ position }) => showFrame(position, 5)};
  }

  #frame7 {
    opacity: ${({ position }) => showFrame(position, 6)};
  }

  #frame8 {
    opacity: ${({ position }) => showFrame(position, 7)};
  }

  #frame9 {
    opacity: ${({ position }) => showFrame(position, 8)};
  }

  #frame10 {
    opacity: ${({ position }) => showFrame(position, 9)};
  }

  #frame11 {
    opacity: ${({ position }) => showFrame(position, 10)};
  }

  #frame12 {
    opacity: ${({ position }) => showFrame(position, 11)};
  }

  #frame13 {
    opacity: ${({ position }) => showFrame(position, 12)};
  }

  #frame14 {
    opacity: ${({ position }) => showFrame(position, 13)};
  }

  #frame15 {
    opacity: ${({ position }) =>
      showFrame(position, 14) || showFrame(position, 15)};
  }

  @media (max-width: ${MOBILE}) {
    display: none;
  }
`;

export default CubeAnimation;
