import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { identity } from 'mathjs';
import { MOBILE } from '../../constants';

const Wrapper = styled.section`
  margin: 30px 15px;

  display: grid;
  grid-template-rows: 200px 1fr;
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
`;

const Params = styled.div`
  grid-row: 2;
  grid-column: 2;
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
  direction: column;
`;

const Label = styled.div`
  grid-column: 1;
  font-size: 16px;
  color: #848D95;
`;

const NumberInput = styled.input`
  grid-column: 2;
  width: 3rem;
  margin-bottom: 8px;
`;

const TextInput = styled.textarea`
  grid-column: 2;
  margin-top: 8px;
`;

const Preview = styled.section`
  height: 10rem;
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

const Param = ({ id, value, onChange, rows }) => (
  <>
    <Label>
      {id}:
    </Label>
    <TextInput
      id={id}
      value={formatMatrix(value)}
      onChange={onChange}
      rows={rows}
    />
  </>
);

const ChartArea = styled.section`
  margin: 0 16px;
`;

const getPoints = (samples, min, max, width, height) => {
  const offset = min;
  const factor = height / (max - min);
  const sampleWidth = width / samples.length;

  return samples
    .map((sample, index) => {
      const y = (sample - offset) * factor;
      const x = sampleWidth * index;
      return `${x},${y}`;
    })
    .join(' ');
};

const Chart = ({
  rows,
  columnIndex,
  width
}) => {
  const height = 100;

  const samples = useMemo(
    () => rows.map(r => Number(r[columnIndex])),
  [rows, columnIndex]);
  
  const { min, max } = useMemo(() => samples.reduce(
    ({ min, max }, sample) => ({
      min: min === undefined ? sample : Math.min(min, sample),
      max: max === undefined ? sample : Math.max(max, sample)
    }), {}),
  []);

  if (!width) return null;

  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        fill="none"
        stroke="#FF008E"
        strokeMiterlimit="10"
        points={getPoints(samples, min, max, width, height)}
      />
    </svg>
  );
};

const getInitialParams = (order) => ({
  A: order === 1 ? 0 : identity(order),
  B: order === 1 ? 0 : identity(order, 1),
  C: order === 1 ? 0 : identity(1, order),
  D: 0,
  Q: order === 1 ? 0 : identity(order),
  R: 0,
  x0: order === 1 ? 0 : identity(order, 1),
  P0: order === 1 ? 0 : identity(order)
})

const formatMatrix = m => (
  m
    .toString()
    .replace('[[', '[\n  [')
    .replace(']]', ']\n]')
    .replace('], ', '],\n  ')
    .replace('], [', '],\n  [')
);

const readMatrix = m => m;

const parseDataset = (text) => {
  const allRows = text?.split('\n')?.map(r => r.trim()) ?? [];
  const columns = allRows?.[0]?.split(',')?.map(c => c.trim()) ?? [];
  const rows = allRows.slice(1).map(r => r?.split(',')?.map(c => c.trim()) ?? []);

  return { rows, columns };
}

const KalmanFilter = () => {
  const [ order, setOrder ] = useState(1);
  const [ params, setParams ] = useState(getInitialParams(order));
  const [ columnMap, setColumnMap ] = useState({ z: 2, u: 1 });
  const [ columns, setColumns ] = useState([])
  const [ rows, setRows ] = useState([])
  const [ dataset, setDataset ] = useState()

  const { z, u } = columnMap;
  const { A, B, C, D, Q, x0, P0 } = params;

  const handleOrderChange = useCallback(({
    target: {
      value
    }
  }) => {
    setOrder(parseInt(value))
  }, [])

  const handleParamChange = useCallback(({
    target: {
      id,
      value
    }
  }) => {
    setParams(p => ({
      ...p,
      [id]: readMatrix(value)
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
    setParams(getInitialParams(order))
  }, [order])

  useEffect(() => {
    const { rows, columns } = parseDataset(dataset);
    setRows(rows);
    setColumns(columns);
  }, [dataset])

  const matrixParam = {
    rows: order === 1 ? 1 : order + 2,
    onChange: handleParamChange
  }

  const chartAreaRef = useRef()

  return (
    <Wrapper>
      <h3>Kalman Filter</h3>
      {Boolean(rows.length) && <Plot>
        <ChartArea ref={chartAreaRef}>
          <Chart
            rows={rows}
            columnIndex={z - 1}
            width={chartAreaRef.current?.clientWidth}
          />
        </ChartArea>
      </Plot>}
      <Dataset>
        <h3>Dataset</h3>
        <p>Drop or pick a .csv file to load data:</p>

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
        <Form>
          <Label>Order:</Label>
          <NumberInput
            id="order"
            type="number"
            value={order}
            onChange={handleOrderChange}
          />
          <Param id="A" value={A} {...matrixParam} />
          <Param id="B" value={B} {...matrixParam} />
          <Param id="C" value={C} {...matrixParam} />
          <Param id="D" value={D} {...matrixParam} />
          <Param id="Q" value={Q} {...matrixParam} />
          <Param id="x0" value={x0} {...matrixParam} />
          <Param id="P0" value={P0} {...matrixParam} />
        </Form>
      </Params>
    </Wrapper>
  );
};

export default KalmanFilter;