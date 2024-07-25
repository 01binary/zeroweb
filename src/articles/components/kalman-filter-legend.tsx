import React from 'react';
import styled from 'styled-components';
import { MOBILE } from '../../constants';

const legend = [
  {
    color: '#FF008E',
    text: 'measurement'
  },
  {
    color: '#376BE8',
    text: 'estimate'
  },
  {
    color: '#00FFC2',
    text: 'estimate uncertainty'
  },
  {
    color: '#888888',
    text: 'gain'
  }
]

const LegendWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: ${MOBILE}) {
    flex-direction: column;
  }
`;

const LegendItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

const LegendBox = styled.div<{ color: string }>`
  background-color: ${props => props.color};
  width: 18px;
  height: 18px;
`;

const LegendText = styled.div`
  font-size: ${props => props.theme.normalFontSize};
  font-family: ${props => props.theme.normalFont};
  line-height: ${props => props.theme.normalFontLineHeight};
`;

const KalmanFilterLegend = () => (
  <LegendWrapper>
    {legend.map(({ color, text }) => (
      <LegendItem>
        <LegendBox color={color} />
        <LegendText>{text}</LegendText>
      </LegendItem>
    ))}
  </LegendWrapper>
);

export default KalmanFilterLegend;
