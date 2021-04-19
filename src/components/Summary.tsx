import React from 'react';
import styled from 'styled-components';

const Summary = styled.p`
  text-transform: lowercase;
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
`;

export default Summary;
