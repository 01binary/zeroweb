import styled from 'styled-components';
import { MOBILE } from '../../constants';
import Hello from '../../images/hello.svg';

const HELLO_DURATION = 1;

const HelloAnimation = styled(Hello)`
  position: absolute;
  left: 0;
  top: ${(props) => props.theme.spacing};
  z-index: -1;

  @media (max-width: ${MOBILE}) {
    position: initial;
    margin-bottom: ${(props) => props.theme.spacingHalf};
  }

  #arm1 {
    opacity: 0;
    animation: frame1 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm2 {
    opacity: 0;
    animation: frame2 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm3 {
    opacity: 0;
    animation: frame3 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm4 {
    opacity: 0;
    animation: frame4 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm5 {
    opacity: 0;
    animation: frame5 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm6 {
    opacity: 0;
    animation: frame6 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm7 {
    opacity: 0;
    animation: frame7 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm8 {
    opacity: 0;
    animation: frame8 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm9 {
    opacity: 0;
    animation: frame9 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm10 {
    opacity: 0;
    animation: frame10 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm11 {
    opacity: 0;
    animation: frame11 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm12 {
    opacity: 0;
    animation: frame12 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm13 {
    opacity: 0;
    animation: frame13 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm14 {
    opacity: 0;
    animation: frame14 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm15 {
    opacity: 0;
    animation: frame15 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm16 {
    opacity: 0;
    animation: frame16 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm17 {
    opacity: 0;
    animation: frame17 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm18 {
    opacity: 0;
    animation: frame18 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm19 {
    opacity: 0;
    animation: frame19 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm20 {
    opacity: 0;
    animation: frame20 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm21 {
    opacity: 0;
    animation: frame21 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm22 {
    opacity: 0;
    animation: frame22 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm23 {
    opacity: 0;
    animation: frame23 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm24 {
    opacity: 0;
    animation: frame24 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm25 {
    opacity: 0;
    animation: frame25 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm26 {
    opacity: 0;
    animation: frame26 ${HELLO_DURATION}s steps(1) infinite;
  }

  #arm27 {
    opacity: 0;
    animation: frame27 ${HELLO_DURATION}s steps(1) infinite;
  }

  #motionline1 {
    opacity: 0;
    animation: motionline1 ${HELLO_DURATION}s ease-in-out infinite;
  }

  #motionline2 {
    opacity: 0;
    animation: motionline2 ${HELLO_DURATION}s ease-in-out infinite;
  }

  @keyframes frame1 {
    0% {
      opacity: 1;
    }
    1% {
      opacity: 0;
    }
  }

  @keyframes frame2 {
    1% {
      opacity: 1;
    }
    4% {
      opacity: 0;
    }
  }

  @keyframes frame3 {
    4% {
      opacity: 1;
    }
    9% {
      opacity: 0;
    }
  }

  @keyframes frame4 {
    9% {
      opacity: 1;
    }
    12% {
      opacity: 0;
    }
  }

  @keyframes frame5 {
    12% {
      opacity: 1;
    }
    15% {
      opacity: 0;
    }
  }

  @keyframes frame6 {
    15% {
      opacity: 1;
    }
    18% {
      opacity: 0;
    }
  }

  @keyframes frame7 {
    18% {
      opacity: 1;
    }
    21% {
      opacity: 0;
    }
  }

  @keyframes frame8 {
    21% {
      opacity: 1;
    }
    24% {
      opacity: 0;
    }
  }

  @keyframes frame9 {
    24% {
      opacity: 1;
    }
    27% {
      opacity: 0;
    }
  }

  @keyframes frame10 {
    27% {
      opacity: 1;
    }
    30% {
      opacity: 0;
    }
  }

  @keyframes frame11 {
    30% {
      opacity: 1;
    }
    33% {
      opacity: 0;
    }
  }

  @keyframes frame12 {
    33% {
      opacity: 1;
    }
    36% {
      opacity: 0;
    }
  }

  @keyframes frame13 {
    36% {
      opacity: 1;
    }
    39% {
      opacity: 0;
    }
  }

  @keyframes frame14 {
    39% {
      opacity: 1;
    }
    42% {
      opacity: 0;
    }
  }

  @keyframes frame15 {
    42% {
      opacity: 1;
    }
    45% {
      opacity: 0;
    }
  }

  @keyframes frame16 {
    45% {
      opacity: 1;
    }
    48% {
      opacity: 0;
    }
  }

  @keyframes frame17 {
    48% {
      opacity: 1;
    }
    51% {
      opacity: 0;
    }
  }

  @keyframes frame18 {
    51% {
      opacity: 1;
    }
    54% {
      opacity: 0;
    }
  }

  @keyframes frame19 {
    54% {
      opacity: 1;
    }
    57% {
      opacity: 0;
    }
  }

  @keyframes frame20 {
    57% {
      opacity: 1;
    }
    60% {
      opacity: 0;
    }
  }

  @keyframes frame21 {
    60% {
      opacity: 1;
    }
    63% {
      opacity: 0;
    }
  }

  @keyframes frame22 {
    63% {
      opacity: 1;
    }
    66% {
      opacity: 0;
    }
  }

  @keyframes frame23 {
    66% {
      opacity: 1;
    }
    69% {
      opacity: 0;
    }
  }

  @keyframes frame24 {
    69% {
      opacity: 1;
    }
    73% {
      opacity: 0;
    }
  }

  @keyframes frame25 {
    73% {
      opacity: 1;
    }
    78% {
      opacity: 0;
    }
  }

  @keyframes frame26 {
    78% {
      opacity: 1;
    }
    82% {
      opacity: 0;
    }
  }

  @keyframes frame27 {
    82% {
      opacity: 1;
    }
  }

  @keyframes motionline1 {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 0.25;
    }
    40% {
      opacity: 0.1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes motionline2 {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 0;
    }
    40% {
      opacity: 0.5;
    }
    100% {
      opacity: 0.1;
    }
  }
`;

export default HelloAnimation;
