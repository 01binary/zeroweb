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
import LoadImage from './load';
import ChartBackground from './chart-background';
import defaultMapping from './kalman-mapping.json';
import defaultParams from './kalman-params.json';
import defaultInput from './kalman-input.json';

//
// Kalman Filter in JavaScript
//

const kalmanFilter = ({
  inputs,
  measurements,
  A, B, C, D, P0, Q, R, x0
}) => {
  const Atrans = transpose(A);
  const Ctrans = transpose(C);
  const I = identity(x0.size());

  let y = measurements[0];
  let x = x0;
  let P = P0;

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

//
// Styled Components
//

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

const ChartArea = styled.section`
  margin: 24px 16px 0 16px;
`;

//
// Helpers
//

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

const formatMatrix = m => (
  m
    ?.toString()
    ?.replace('[[', '[\n  [')
    ?.replace(']]', ']\n]')
    ?.replace('],[', '],\n  [')
);

const loadMatrix = m => {
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
};

const serializeParams = (params) => ({
  A: formatMatrix(JSON.stringify(params.A)),
  B: formatMatrix(JSON.stringify(params.B)),
  C: formatMatrix(JSON.stringify(params.C)),
  D: params.D.toString(),
  P0: formatMatrix(JSON.stringify(params.P0)),
  Q: formatMatrix(JSON.stringify(params.Q)),
  R: params.R.toString(),
  x0: formatMatrix(JSON.stringify(params.x0))
});

//
// Components
//

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
      <ChartBackground />
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
    </svg>
  );
};

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

const KalmanDemo = () => {
  const [ params, setParams ] = useState(serializeParams(defaultParams));
  const [ columnMap, setColumnMap ] = useState(defaultMapping);
  const [ columns, setColumns ] = useState(defaultInput[0]);
  const [ rows, setRows ] = useState(defaultInput.slice(1));
  const [ dataset, setDataset ] = useState();

  const { z, u } = columnMap;
  const { A, B, C, D, Q, P0, R, x0 } = params;

  const outputs = useMemo(() => {
    const inputs = rows.map(r => r[u - 1]);
    const measurements = rows.map(r => r[z - 1]);

    try {
      return kalmanFilter({
        inputs,
        measurements,
        A: loadMatrix(A),
        B: loadMatrix(B),
        C: loadMatrix(C),
        D,
        Q: loadMatrix(Q),
        R,
        x0: loadMatrix(x0),
        P0: loadMatrix(P0)
      });
    } catch {
      return [];
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
      [id]: value.toString()
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

export default KalmanDemo;