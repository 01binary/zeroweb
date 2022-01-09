import React, { FC } from 'react';
import styled from 'styled-components';
import SnapIcon from '../images/snap.svg';

const StaticSnapIcon = styled(SnapIcon)`
  #frame4 {
    opacity: 1;
  }

  #frame1,
  #frame2,
  #frame3 {
    opacity: 0;
  }
`;

const AnimatedSnapIcon = styled(SnapIcon)`
  #frame1 {
    opacity: 0;
    animation: snapFrame1 0.4s steps(1) 1;
  }

  #frame2 {
    opacity: 0;
    animation: snapFrame2 0.4s steps(1) 1;
  }

  #frame3 {
    opacity: 0;
    animation: snapFrame3 0.4s steps(1) 1;
  }

  #frame4 {
    opacity: 0;
    animation: snapFrame4 0.4s steps(1) 1;
  }

  @keyframes snapFrame1 {
    0% {
      opacity: 1;
    }
    25% {
      opacity: 0;
    }
  }

  @keyframes snapFrame2 {
    25% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  @keyframes snapFrame3 {
    50% {
      opacity: 1;
    }
    75% {
      opacity: 0;
    }
  }

  @keyframes snapFrame4 {
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

type SnapProps = {
  className?: string;
  animate: boolean;
};

const Snap: FC<SnapProps> = ({ className, animate }) =>
  animate ? (
    <AnimatedSnapIcon className={className} />
  ) : (
    <StaticSnapIcon className={className} />
  );

export default Snap;
