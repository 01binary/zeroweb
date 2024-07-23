import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';
import {
  identity,
  matrix,
  transpose,
  multiply,
  divide,
  add,
  subtract
} from 'mathjs';
import { MOBILE } from '../../constants';
import defaultMapping from './kalman-mapping.json';
import defaultParams from './kalman-params.json';
import defaultInput from './kalman-input.json';

const Wrapper = styled.section`
  display: grid;
  grid-template-rows: 220px 600px;
  grid-template-columns: 1fr 1fr;
  width: calc(100% - 30px);

  p {
    font-size: 16px;
    color: #848D95;
  }

  @media (max-width: ${MOBILE}) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const Plot = styled.div`
  grid-row: 1;
  grid-column-start: 1;
  grid-column-end: none;

  height: 200px;
`;

const Dataset = styled.div`
  grid-row: 2;
  grid-column: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: ${MOBILE}) {
    max-height: 720px;
  }
`;

const Params = styled.div`
  grid-row: 2;
  grid-column: 2;
  display: flex;
  flex-direction: column;
`;

const LoadImage = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="65.4px"
    height="81.7px"
    viewBox="0 0 102.2 127.6"
  >
    <path fill="#CDCDCD" d="M0.7,39c0-6.6,0-13.1,0-19.7c0-3.2-0.2-6.4,0-9.5c0.1-2.7,1.5-5.2,3.7-6.7c2.7-1.7,5.4-2,8.5-1.9
      c3.1,0.1,6.2,0.1,9.3,0.1c6.4-0.1,12.8,0,19.3-0.1c12.8-0.2,25.7,0,38.6,0c3.2,0,6.5,0,9.7,0c2.8,0,5.5,0,7.8,1.6
      c2,1.4,3.5,3.4,3.9,5.9c0.2,1.5,0.1,3,0.1,4.5c0,1.7,0,3.3,0,5c0,13,0.3,26,0.3,39c0,3.1,0,6.1,0,9.2c0,0.7,0.4,3.6-1,3
      c-1.4-0.6-2.7-1.6-4-2.4c-0.7-0.4-1.3-0.8-2-1.2c-0.5-0.3-1.4-0.8-1.8-1.3c-0.3-0.5-0.2-1.4-0.2-2c0-0.9-0.1-1.7-0.1-2.6
      c-0.2-3.2-0.5-6.4-0.7-9.7c-0.1-1.5-0.1-3.1-0.4-4.6c-0.3-1.4-0.9-2.8-1.6-4c-0.7-1.2-1.5-2.2-2.4-3.1c-1-0.9-2-2-3.1-2.6
      c-2.5-1.5-5.7-2-8.6-2c-3.2,0-6.5,0-9.7,0c-12.8,0-25.7-0.2-38.5,0.1c-3.1,0.1-5.9,0-8.8,1.3c-2.6,1.2-4.8,3.1-6.3,5.5
      c-1.7,2.6-2.2,5.5-2.4,8.6c-0.2,3.2-0.3,6.4-0.6,9.7c-0.1,1.5,0,3.2-0.2,4.7c-0.2,1.2-1.6,1.7-2.5,2.2c-1.3,0.8-2.6,1.6-3.9,2.4
      c-0.4,0.3-1.3,1-1.8,1c-0.7,0-0.6-0.8-0.6-1.3c0-6.5,0.1-13.1,0-19.6C0.7,45.2,0.7,42.1,0.7,39C0.7,39,0.7,39,0.7,39z"/>
    <path fill="#CDCDCD" d="M96,107.5c-0.4,3.3,0,6.7-0.1,10c0,3-1.3,5.9-4,7.4c-2.4,1.4-5.7,1.7-8.2,0.4c-2.6-1.3-4.3-3.9-4.5-6.8
      c-0.3-3.7,0-7.4-0.2-11.1c-11.5-0.4-23,0-34.5-0.1c-5.7-0.1-11.4-0.1-17.1,0c-0.6,0-1.3,0-1.9,0c-0.6,0-1.4-0.1-1.9,0.1
      c-0.7,0.3-0.4,1.9-0.4,2.5c0,2.9,0.2,5.8,0,8.7c-0.3,4.6-4.9,7.9-9.3,7.4c-2.2-0.2-4.4-1.4-5.8-3.2c-1.7-2.2-1.6-4.8-1.6-7.4
      c0-1.4,0-2.9,0-4.3c0-0.7,0-1.3,0-2c0-0.4,0.1-1,0-1.4c-0.2-0.7-1.4-0.4-1.9-0.4c-0.6,0-1.3,0-1.9,0c-0.4,0-1.1,0.1-1.5-0.1
      c-0.7-0.4-0.4-2.6-0.4-3.2c0-1.4,0-2.8,0-4.1c0.1-2.8,0-5.6,0-8.4c0-2.9,0-5.8-0.1-8.7c0-1.5,0-2.9,0-4.4c0-1-0.4-2.6,0.3-3.5
      c0.7-0.9,2.2-1.5,3.2-2.1c1.2-0.7,2.3-1.4,3.5-2.1c1.2-0.7,2.4-1.5,3.6-2.2c1-0.6,2.2-1.1,2.4-2.4c0.2-1.4,0.1-2.9,0.1-4.4
      c0-1.4,0.1-2.8,0.2-4.2c0.2-2.9,0.4-5.7,0.6-8.6c0.2-2.7,0.9-5.1,2.8-7.1c1.8-1.9,4.1-3,6.7-3.3c1.4-0.2,2.9-0.1,4.3,0
      c1.4,0,2.8,0,4.2,0c2.9,0,5.9,0,8.8,0c5.7,0,11.4,0,17.1,0c5.9,0,11.7-0.1,17.6,0c2.6,0,5.1,0.6,7.2,2.2c1.8,1.4,3.6,4,3.9,6.3
      c0.6,5.7,0.9,11.5,1.3,17.2c0.1,1-0.1,2.5,0.7,3.3c0.5,0.4,1.1,0.7,1.7,1c0.6,0.4,1.2,0.7,1.8,1.1c2.3,1.4,4.7,2.8,7,4.2
      c0.5,0.3,1.3,0.7,1.6,1.1c0.4,0.4,0.3,1.1,0.4,1.6c0.1,1.4,0,2.8,0,4.2c0,2.8,0.1,5.6,0.1,8.5c0,2.9-0.2,5.7-0.1,8.6
      c0.1,2.9,0,5.7-0.1,8.6c0,1.3-0.9,1.2-2,1.2C98.5,107.4,97.3,107.4,96,107.5z M72.8,66.9c2.9,0,5.7,0,8.6,0.1c0.8,0,2.3,0.3,2.4-0.8
      c0.1-1.3-0.1-2.8-0.2-4.1c-0.2-2.9-0.4-5.7-0.6-8.5c-0.1-1.4-0.3-2.9-0.3-4.3c0-1.2-0.2-2.3-0.9-3.3c-0.6-0.9-1.4-1.7-2.4-2.2
      c-1.1-0.5-2.4-0.5-3.6-0.5c-2.9,0-5.8,0-8.7,0c-11.7-0.1-23.4,0-35.1,0c-1.4,0-2.9,0-4.3,0c-1.2,0-2.6-0.1-3.8,0.3
      c-2.5,0.8-3.7,3.2-4,5.6c-0.2,2.8-0.3,5.6-0.5,8.5c-0.1,1.5-0.2,3-0.3,4.5c-0.1,1.3-0.4,2.8-0.2,4c0.2,1,1.3,0.8,2.1,0.8
      c1.4-0.1,2.8,0,4.2,0C28.1,66.9,67.1,66.8,72.8,66.9z M35.8,75.8c-1.2,0-2.4,0-3.6,0c-1,0-1.9,0-2.8,0.6c-1.9,1.3-1.3,4-1.3,5.9
      c0,2.3,0,4.5,0,6.8c0,1.1,0,2.3,0,3.4c0,1-0.2,2.3,0.1,3.2c0.3,0.8,1.1,0.7,1.8,0.7c1.1,0,2.1,0,3.2,0c2.3,0,4.5,0,6.8,0
      c4.5,0,8.9,0,13.4,0.1c4.4,0,8.8-0.1,13.2,0c2.1,0,4.4,0.3,6.5,0c1.1-0.2,1.3-0.4,1.3-1.4c0-1,0-2,0-3c0-4.4,0.1-8.9-0.1-13.3
      c-0.1-1.7-1.5-2.9-3.2-3.1C69,75.6,40.9,75.8,35.8,75.8z M88,78.9c-1.7,0.2-3,0.5-4.4,1.7c-1.3,1.1-1.9,2.3-2.2,4
      c-0.4,2.7,0.7,5.2,3,6.7c2.2,1.5,5.1,1.4,7.3-0.1c2.4-1.7,3.4-4.7,2.5-7.6C93.4,80.9,90.9,79,88,78.9z M20.9,85.9
      c0.1-1.7-0.4-3-1.5-4.3c-1-1.1-2.2-1.9-3.6-2.3c-2.5-0.8-5.3,0.4-6.8,2.5c-1.8,2.4-1.6,5.9,0.3,8.2c0.8,1,1.8,1.7,2.9,2.2
      c1.5,0.6,2.8,0.6,4.2,0C19,91.2,21.2,88.8,20.9,85.9z"/>
  </svg>
)

const Load = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  border: 2px dotted #cdcdcd;
  border-radius: 8px;
  margin: 16px;
  padding: 16px;

  cursor: pointer;

  svg {
    pointer-events: none;
  }
`;

const Form = styled.div`
  display: grid;
  grid-template-rows: repeat(auto);
  grid-template-columns: max-content, 1fr;
  margin-left: 16px;
  margin-right: 16px;
`;

const Scrollable = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Label = styled.div`
  grid-column: 1;
  font-size: 16px;
  color: #848D95;
`;

const Description = styled.div`
  grid-column: 2;
  font-size: 16px;
  color: #848D95;
`;

const NumberInput = styled.input`
  grid-column: 2;
  width: 3rem;
  margin-bottom: 8px;

  padding: 8px;

  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.foregroundColor};
  border: ${(props) => props.theme.border} solid ${(props) => props.theme.borderColor};

  &:focus {
    outline-color: ${(props) => props.theme.focusColor};
    outline-style: solid;
    outline-width: medium;
    border-radius: 1px;
  }
`;

const TextInput = styled.textarea`
  grid-column: 2;
  margin-top: 8px;
  margin-bottom: 8px;
  min-width: 320px;

  padding: 8px;

  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.foregroundColor};
  border: ${(props) => props.theme.border} solid ${(props) => props.theme.borderColor};

  &:focus {
    outline-color: ${(props) => props.theme.focusColor};
    outline-style: solid;
    outline-width: medium;
    border-radius: 1px;
  }
`;

const Preview = styled.section`
  overflow: auto;
  margin: 16px;
`;

const PreviewTable = styled.table`
  font-family: monospace;
  font-size: smaller;
  width: 100%;

  td {
    border-bottom: 1px solid #cdcdcd;
    padding-bottom: 4px;
  }

  th {
    text-align: left;
  }
`;

const Param = ({ id, value, description, onChange, rows }) => (
  <>
    <Label>{id}:</Label>
    <Description>{description}</Description>
    <TextInput
      id={id}
      value={formatMatrix(value)}
      onChange={onChange}
      rows={rows}
    />
  </>
);

const ChartArea = styled.section`
  margin: 24px 16px 0 16px;
`;

const getPoints = (samples, min, max, width, height, xOffset, yOffset) => {
  const offset = min;
  const factor = (height - 2) / (max - min);
  const sampleWidth = width / samples.length;

  return samples
    ?.map((sample, index) => {
      const y = (sample - offset) * factor + 1 + yOffset;
      const x = sampleWidth * index + xOffset;
      return `${x},${y}`;
    })
    ?.join(' ') ?? '';
};

const Chart = ({
  rows,
  columnIndex,
  outputs,
  width
}) => {
  const height = 200;
  const rulerMarkSize = 40;

  const samples = useMemo(
    () => rows.map(r => Number(r[columnIndex])),
  [rows, columnIndex]);
  
  const { min, max } = useMemo(() => samples.reduce(
    ({ min, max }, sample) => ({
      min: min === undefined ? sample : Math.min(min, sample),
      max: max === undefined ? sample : Math.max(max, sample)
    }), {}),
  [samples]);

  if (!width) return null;

  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox={`0 0 ${width} ${height}`}
    >
      <circle fill="#888888" cx="42.7" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="63.6" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="84.5" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="105.4" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="126.3" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="147.1" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="42.7" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="63.6" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="84.5" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="105.4" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="126.3" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="147.1" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="42.7" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="63.6" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="84.5" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="105.4" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="126.3" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="147.1" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="42.7" cy="6" r="1.4"/>
      <circle fill="#888888" cx="63.6" cy="6" r="1.4"/>
      <circle fill="#888888" cx="84.5" cy="6" r="1.4"/>
      <circle fill="#888888" cx="105.4" cy="6" r="1.4"/>
      <circle fill="#888888" cx="126.3" cy="6" r="1.4"/>
      <circle fill="#888888" cx="147.1" cy="6" r="1.4"/>
      <circle fill="#888888" cx="168" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="188.9" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="209.8" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="230.7" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="251.5" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="168" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="188.9" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="209.8" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="230.7" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="251.5" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="168" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="188.9" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="209.8" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="230.7" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="251.5" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="168" cy="6" r="1.4"/>
      <circle fill="#888888" cx="188.9" cy="6" r="1.4"/>
      <circle fill="#888888" cx="209.8" cy="6" r="1.4"/>
      <circle fill="#888888" cx="230.7" cy="6" r="1.4"/>
      <circle fill="#888888" cx="251.5" cy="6" r="1.4"/>
      <circle fill="#888888" cx="272.4" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="293.3" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="314.2" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="335.1" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="355.9" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="272.4" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="293.3" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="314.2" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="335.1" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="355.9" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="272.4" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="293.3" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="314.2" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="335.1" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="355.9" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="272.4" cy="6" r="1.4"/>
      <circle fill="#888888" cx="293.3" cy="6" r="1.4"/>
      <circle fill="#888888" cx="314.2" cy="6" r="1.4"/>
      <circle fill="#888888" cx="335.1" cy="6" r="1.4"/>
      <circle fill="#888888" cx="355.9" cy="6" r="1.4"/>
      <circle fill="#888888" cx="376.8" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="397.7" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="418.6" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="439.5" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="460.3" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="376.8" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="397.7" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="418.6" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="439.5" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="460.3" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="376.8" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="397.7" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="418.6" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="439.5" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="460.3" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="376.8" cy="6" r="1.4"/>
      <circle fill="#888888" cx="397.7" cy="6" r="1.4"/>
      <circle fill="#888888" cx="418.6" cy="6" r="1.4"/>
      <circle fill="#888888" cx="439.5" cy="6" r="1.4"/>
      <circle fill="#888888" cx="460.3" cy="6" r="1.4"/>
      <circle fill="#888888" cx="42.7" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="63.6" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="84.5" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="105.4" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="126.3" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="147.1" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="42.7" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="63.6" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="84.5" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="105.4" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="126.3" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="147.1" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="42.7" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="63.6" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="84.5" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="105.4" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="126.3" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="147.1" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="168" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="188.9" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="209.8" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="230.7" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="251.5" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="168" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="188.9" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="209.8" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="230.7" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="251.5" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="168" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="188.9" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="209.8" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="230.7" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="251.5" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="272.4" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="293.3" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="314.2" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="335.1" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="355.9" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="272.4" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="293.3" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="314.2" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="335.1" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="355.9" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="272.4" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="293.3" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="314.2" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="335.1" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="355.9" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="376.8" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="397.7" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="418.6" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="439.5" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="460.3" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="376.8" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="397.7" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="418.6" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="439.5" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="460.3" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="376.8" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="397.7" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="418.6" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="439.5" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="460.3" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="481.2" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="502.1" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="523" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="543.9" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="564.7" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="481.2" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="502.1" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="523" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="543.9" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="564.7" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="481.2" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="502.1" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="523" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="543.9" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="564.7" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="481.2" cy="6" r="1.4"/>
      <circle fill="#888888" cx="502.1" cy="6" r="1.4"/>
      <circle fill="#888888" cx="523" cy="6" r="1.4"/>
      <circle fill="#888888" cx="543.9" cy="6" r="1.4"/>
      <circle fill="#888888" cx="564.7" cy="6" r="1.4"/>
      <circle fill="#888888" cx="585.6" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="606.5" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="627.4" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="648.3" cy="68.6" r="1.4"/>
      <circle fill="#888888" cx="585.6" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="606.5" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="627.4" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="648.3" cy="47.8" r="1.4"/>
      <circle fill="#888888" cx="585.6" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="606.5" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="627.4" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="648.3" cy="26.9" r="1.4"/>
      <circle fill="#888888" cx="585.6" cy="6" r="1.4"/>
      <circle fill="#888888" cx="606.5" cy="6" r="1.4"/>
      <circle fill="#888888" cx="627.4" cy="6" r="1.4"/>
      <circle fill="#888888" cx="648.3" cy="6" r="1.4"/>
      <circle fill="#888888" cx="481.2" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="502.1" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="523" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="543.9" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="564.7" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="481.2" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="502.1" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="523" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="543.9" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="564.7" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="481.2" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="502.1" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="523" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="543.9" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="564.7" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="42.7" cy="173" r="1.4"/>
      <circle fill="#888888" cx="63.6" cy="173" r="1.4"/>
      <circle fill="#888888" cx="84.5" cy="173" r="1.4"/>
      <circle fill="#888888" cx="105.4" cy="173" r="1.4"/>
      <circle fill="#888888" cx="126.3" cy="173" r="1.4"/>
      <circle fill="#888888" cx="147.1" cy="173" r="1.4"/>
      <circle fill="#888888" cx="42.7" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="63.6" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="84.5" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="105.4" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="126.3" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="147.1" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="168" cy="173" r="1.4"/>
      <circle fill="#888888" cx="188.9" cy="173" r="1.4"/>
      <circle fill="#888888" cx="209.8" cy="173" r="1.4"/>
      <circle fill="#888888" cx="230.7" cy="173" r="1.4"/>
      <circle fill="#888888" cx="251.5" cy="173" r="1.4"/>
      <circle fill="#888888" cx="168" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="188.9" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="209.8" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="230.7" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="251.5" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="272.4" cy="173" r="1.4"/>
      <circle fill="#888888" cx="293.3" cy="173" r="1.4"/>
      <circle fill="#888888" cx="314.2" cy="173" r="1.4"/>
      <circle fill="#888888" cx="335.1" cy="173" r="1.4"/>
      <circle fill="#888888" cx="355.9" cy="173" r="1.4"/>
      <circle fill="#888888" cx="272.4" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="293.3" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="314.2" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="335.1" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="355.9" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="376.8" cy="173" r="1.4"/>
      <circle fill="#888888" cx="397.7" cy="173" r="1.4"/>
      <circle fill="#888888" cx="418.6" cy="173" r="1.4"/>
      <circle fill="#888888" cx="439.5" cy="173" r="1.4"/>
      <circle fill="#888888" cx="460.3" cy="173" r="1.4"/>
      <circle fill="#888888" cx="376.8" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="397.7" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="418.6" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="439.5" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="460.3" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="481.2" cy="173" r="1.4"/>
      <circle fill="#888888" cx="502.1" cy="173" r="1.4"/>
      <circle fill="#888888" cx="523" cy="173" r="1.4"/>
      <circle fill="#888888" cx="543.9" cy="173" r="1.4"/>
      <circle fill="#888888" cx="564.7" cy="173" r="1.4"/>
      <circle fill="#888888" cx="481.2" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="502.1" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="523" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="543.9" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="564.7" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="585.6" cy="173" r="1.4"/>
      <circle fill="#888888" cx="606.5" cy="173" r="1.4"/>
      <circle fill="#888888" cx="627.4" cy="173" r="1.4"/>
      <circle fill="#888888" cx="648.3" cy="173" r="1.4"/>
      <circle fill="#888888" cx="585.6" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="606.5" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="627.4" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="648.3" cy="152.2" r="1.4"/>
      <circle fill="#888888" cx="585.6" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="606.5" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="627.4" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="648.3" cy="131.3" r="1.4"/>
      <circle fill="#888888" cx="585.6" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="606.5" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="627.4" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="648.3" cy="110.4" r="1.4"/>
      <circle fill="#888888" cx="585.6" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="606.5" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="627.4" cy="89.5" r="1.4"/>
      <circle fill="#888888" cx="648.3" cy="89.5" r="1.4"/>
      <polyline
        fill="none"
        stroke="#FF008E"
        strokeMiterlimit="10"
        points={getPoints(
          samples, min, max, width - rulerMarkSize, height - rulerMarkSize, rulerMarkSize, 0
        )}
      />
      <polyline
        fill="none"
        stroke="#12C0E1"
        strokeMiterlimit="10"
        points={getPoints(
          outputs, min, max, width - rulerMarkSize, height - rulerMarkSize, rulerMarkSize, 0
        )}
      />
      <g>
        <g>
          <polyline strokeWidth="1.5" fill="none" stroke="#AAAAAA" points="1.2,5.4 25.5,5.4 25.5,168.2 1.2,168.2 		"/>
        </g>
        <g>
          <line strokeWidth="1.5" fill="none" stroke="#AAAAAA" x1="17.4" y1="30.9" x2="25.5" y2="30.9"/>
          <line strokeWidth="1.5" fill="none" stroke="#AAAAAA" x1="17.4" y1="86.4" x2="25.5" y2="86.4"/>
          <line strokeWidth="1.5" fill="none" stroke="#AAAAAA" x1="9.3" y1="58.6" x2="25.5" y2="58.6"/>
          <line strokeWidth="1.5" fill="none" stroke="#AAAAAA" x1="9.3" y1="114.2" x2="25.5" y2="114.2"/>
          <line strokeWidth="1.5" fill="none" stroke="#AAAAAA" x1="17.4" y1="141.9" x2="25.5" y2="141.9"/>
        </g>
      </g>
    </svg>
  );
};

const formatMatrix = m => (
  m
    ?.toString()
    ?.replace('[[', '[\n  [')
    ?.replace(']]', ']\n]')
    ?.replace('], ', '],\n  ')
    ?.replace('], [', '],\n  [')
);

const readMatrix = m => {
  try {
    return matrix(eval(m));
  } catch {
    return m;
  }
};

const parseDataset = (text) => {
  const allRows = text
    ?.split('\n')
    ?.map(r => r.trim()) ?? [];

  const columns = allRows
    ?.[0]
    ?.split(',')
    ?.map(c => c.trim()) ?? [];

  const rows = allRows
    ?.slice(1)
    ?.map(r => r?.split(',')?.map(c => c.trim()) ?? []);

  return { rows, columns };
}

const parseParameters = (params) => {
  const A = matrix(params.A);
  const B = matrix(params.B);
  const C = matrix(params.C);
  const D = params.D;
  const Q = matrix(params.Q);
  const P0 = matrix(params.P0);
  const R = params.R;
  const x0 = matrix(params.x0);

  return { A, B, C, D, Q, P0, R, x0 };
}

const kalmanFilter = ({
  inputs,
  measurements,
  A, B, C, D, I, P0, Q, R, x0
}) => {
  let y = measurements[0];
  let x = x0;
  let P = P0;

  const Atrans = transpose(A);
  const Ctrans = transpose(C);

  return measurements.map((z, index) => {
    // Input
    const u = inputs[index];

    // Update covariance
    P = add(multiply(multiply(A, P), Atrans), Q);

    // Optimize gain
    const K = divide(
      multiply(P, Ctrans),
      add(
        multiply(multiply(C, P), Ctrans),
        R
      ));

    // Correct state with measurement
    x = add(x, multiply(K, (z - y)));

    // Correct covariance
    P = add(
      multiply(
        multiply(subtract(I, multiply(K, C)), P),
        transpose(subtract(I, multiply(K, C)))),
      multiply(multiply(K, R), transpose(K))
    );

    // Predict
    y = add(multiply(C, x), multiply(D, u))._data[0][0];

    // Update state
    x = add(multiply(A, x), multiply(B, u));

    // Output
    return y;
  });
};

const InteractiveKalmanFilter = () => {
  const [ params, setParams ] = useState(parseParameters(defaultParams));
  const [ columnMap, setColumnMap ] = useState(defaultMapping);
  const [ columns, setColumns ] = useState(defaultInput[0]);
  const [ rows, setRows ] = useState(defaultInput.slice(1));
  const [ dataset, setDataset ] = useState();

  const { z, u } = columnMap;
  const { A, B, C, D, Q, P0, R, x0 } = params;

  const outputs = useMemo(() => {
    const inputs = rows.map(r => r[u - 1]);
    const measurements = rows.map(r => r[z - 1]);
    const I = identity(x0.size());

    try {
      return kalmanFilter({
        inputs,
        measurements,
        A,
        B,
        C,
        D,
        Q,
        R,
        x0,
        P0,
        I
      }) ?? [];
    } catch {
      return []
    }
  }, [rows, z, u, A, B, C, D, Q, x0, P0]);

  const handleParamChange = useCallback(({
    target: {
      id,
      value
    }
  }) => {
    setParams(p => ({
      ...p,
      [id]: id === 'D' || id === 'R'
        ? parseFloat(value)
        : readMatrix(value.toString())
    }))
  }, [])

  const handleColumnIndexChange = useCallback(({
    target: {
      id,
      value
    }
  }) => {
    setColumnMap(p => ({
      ...p,
      [id]: parseInt(value)
    }))
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault();

    const file = e.dataTransfer.items
      ? [...e.dataTransfer.items][0]?.getAsFile()
      : [...e.dataTransfer.files][0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      setDataset(e.target.result);
    };

    reader.readAsText(file);
  }, [])

  useEffect(() => {
    if (!dataset) return;
    const { rows, columns } = parseDataset(dataset);
    setRows(rows);
    setColumns(columns);
  }, [dataset])

  const matrixParam = {
    rows: 5,
    onChange: handleParamChange
  }

  const chartAreaRef = useRef()

  return (
    <Wrapper>
      {Boolean(rows.length) &&
        <Plot>
          <ChartArea ref={chartAreaRef}>
            <Chart
              rows={rows}
              outputs={outputs}
              columnIndex={z - 1}
              width={chartAreaRef.current?.clientWidth}
            />
          </ChartArea>
        </Plot>
      }

      <Dataset>
        <h3>Dataset</h3>
        <p>Drop a .csv file to load data:</p>

        <Load
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <LoadImage />
        </Load>

        <Form>
          <Label>input column:</Label>
          <NumberInput
            id="u"
            type="number"
            value={u}
            onChange={handleColumnIndexChange}
            min={1}
            max={10}
          />

          <Label>measurement column:</Label>
          <NumberInput
            id="z"
            type="number"
            value={z}
            onChange={handleColumnIndexChange}
            min={1}
            max={10}
          />
        </Form>

        {Boolean(rows.length && columns.length) &&
          <Preview>
            <PreviewTable cellSpacing="0">
              <tr>
              {columns.map(c => (
                <th>{c}</th>
              ))}
              </tr>
              {rows.map(r => (
                <tr>
                  {r.map(c => (
                    <td>{c}</td>
                  ))}
                </tr>
              ))}
            </PreviewTable>
          </Preview>
        }
      </Dataset>

      <Params>
        <h3>Parameters</h3>
        <p>Enter filter parameters:</p>

        <Scrollable>
          <Form>
            <Param id="A" description="State transition matrix" value={A} {...matrixParam} />
            <Param id="B" description="Control/input matrix" value={B} {...matrixParam} />
            <Param id="C" description="Measurement matrix" value={C} {...matrixParam} />
            <Param id="D" description="Input contribution to immediate output" value={D} {...matrixParam} />
            <Param id="P0" description="Initial estimate uncertainty matrix" value={P0} {...matrixParam} />
            <Param id="Q" description="State transition noise/disturbance matrix" value={Q} {...matrixParam} />
            <Param id="R" description="Measurement uncertainty" value={R} {...matrixParam} />
            <Param id="x0" description="Initial state vector" value={x0} {...matrixParam} />
          </Form>
        </Scrollable>
      </Params>
    </Wrapper>
  );
};

export default InteractiveKalmanFilter;