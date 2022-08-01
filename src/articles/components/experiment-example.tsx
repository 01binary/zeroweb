import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { Controls, Control } from './controls';
import BeavisAndButthead from './beavis-and-butthead';

const HYSTERESIS_TIME = 700;
const DAMP_TIME = 250;

const interpolate = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  position: number,
  units?: string
) =>
  `${x1 + (x2 - x1) * position}${units ?? ''},${y1 + (y2 - y1) * position}${
    units ?? ''
  }`;

const useHysteresis = (delta: number) => {
  const [hysteresis, setHysteresis] = useState(0);
  const prevDeltaRef = useRef<number>(0);
  const crossCountTimerRef = useRef<number>(0);
  const crossCountRef = useRef<number>(0);

  useEffect(() => {
    if (crossCountTimerRef.current === 0) {
      crossCountTimerRef.current = window.setInterval(() => {
        setHysteresis(crossCountRef.current);
        crossCountRef.current = 0;
      }, HYSTERESIS_TIME);
    }

    return () => {
      clearInterval(crossCountTimerRef.current);
      crossCountTimerRef.current = 0;
    };
  }, []);

  useEffect(() => {
    if (
      (delta < 0 && prevDeltaRef.current >= 0) ||
      (delta >= 0 && prevDeltaRef.current < 0)
    ) {
      crossCountRef.current++;
    }

    prevDeltaRef.current = delta;
  }, [delta]);

  return hysteresis;
};

const useInduction = () => {
  const dampTimerRef = useRef<number>(0);
  const [magnetPosition, setPosition] = useState(0);
  const [magnetDelta, setDelta] = useState(0);
  const [toggle, setToggle] = useState(0);
  const hysteresis = useHysteresis(magnetDelta);

  const moveMagnet = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.valueAsNumber;
      setPosition((prevPosition) => {
        setDelta((value - prevPosition) * toggle);
        if (!dampTimerRef.current)
          dampTimerRef.current = window.setTimeout(() => {
            setDelta(0);
            dampTimerRef.current = 0;
          }, DAMP_TIME);
        return value;
      });
    },
    [toggle]
  );

  const magnetNormalizedDelta = magnetDelta
    ? magnetDelta / Math.abs(magnetDelta)
    : 0;

  return {
    toggle,
    setToggle,
    magnetPosition,
    magnetDelta,
    magnetNormalizedDelta,
    moveMagnet,
    hysteresis,
  };
};

const InductionExperimentGeometry: FC<{
  className?: string;
  magnetPosition: number;
  magnetDelta: number;
  toggle: boolean;
}> = ({ className, magnetPosition, magnetDelta, toggle }) => (
  <svg viewBox="0 0 1755 769" className={className}>
    <g strokeLinecap="round" strokeLinejoin="round">
      <g
        id="grid"
        fill="none"
        stroke="#999999"
        strokeWidth="1.5"
        style={{ opacity: 0.35 }}
      >
        <line x1="483.9" y1="703.4" x2="1633.5" y2="395.6" />
        <line x1="1344.9" y1="544.4" x2="777.6" y2="267.1" />
        <line x1="770" y1="698.3" x2="202.8" y2="420.9" />
        <line x1="706.2" y1="715.4" x2="138.9" y2="438" />
        <line x1="642.3" y1="732.5" x2="75" y2="455.1" />
        <line x1="1153.3" y1="595.7" x2="586" y2="318.4" />
        <line x1="1089.4" y1="612.8" x2="522.1" y2="335.5" />
        <line x1="1025.5" y1="629.9" x2="458.2" y2="352.6" />
        <line x1="961.7" y1="647" x2="394.4" y2="369.7" />
        <line x1="897.8" y1="664.1" x2="330.5" y2="386.7" />
        <line x1="833.9" y1="681.2" x2="266.6" y2="403.8" />
        <line x1="1491.7" y1="326.3" x2="342.1" y2="634" />
        <line x1="1444.4" y1="303.2" x2="294.8" y2="610.9" />
        <line x1="389.3" y1="657.1" x2="1539" y2="349.4" />
        <line x1="1586.2" y1="372.5" x2="436.6" y2="680.3" />
        <line x1="531.2" y1="726.5" x2="1680.8" y2="418.7" />
        <line x1="1536.5" y1="493.1" x2="969.2" y2="215.8" />
        <line x1="1472.6" y1="510.2" x2="905.3" y2="232.9" />
        <line x1="1408.7" y1="527.3" x2="841.4" y2="250" />
        <line x1="1281" y1="561.5" x2="713.7" y2="284.2" />
        <line x1="1217.1" y1="578.6" x2="649.8" y2="301.3" />
        <line x1="1208.1" y1="187.6" x2="58.4" y2="495.4" />
        <line x1="105.7" y1="518.5" x2="1255.3" y2="210.7" />
        <line x1="1302.6" y1="233.8" x2="153" y2="541.6" />
        <line x1="1096.9" y1="181.6" x2="1664.2" y2="458.9" />
        <line x1="247.5" y1="587.8" x2="1397.2" y2="280" />
        <line x1="200.2" y1="564.7" x2="1349.9" y2="256.9" />
        <line x1="1600.3" y1="476" x2="1033" y2="198.7" />
        <polygon points="11.2,472.2 578.4,749.6 1728.1,441.8 1160.8,164.5 	" />
      </g>
      <polygon
        className="whiteFill"
        points="1497.7,288.2 1472.6,295.2 1472.6,330.2 1321.7,369.9 1276.4,347.7 1251.3,354.7 1251.9,451.7 
    1313.1,480.7 1338.2,473.6 1338.2,439 1488.6,397.8 1534.4,421.2 1559.5,414.1 1559.5,318.5 "
      />
      <g id="coil">
        <g>
          <path
            className="whiteFillGreyStroke"
            d="M1559.5,329.1c1.6,3.4,2.9,7.1,4,10.9c4.6,16.7,2.7,32.6-4,40.4"
          />
          <g>
            <polyline
              className="greyStroke"
              points="1559.5,414.1 1559.5,318.5 1497.7,288.2 1472.6,295.2 1472.6,330.2 			"
            />
            <polyline
              className="greyStroke"
              points="1559.5,414.1 1534.4,421.2 1487.7,398 			"
            />
            <polyline
              className="greyStroke"
              points="1559.5,318.5 1534.4,325.2 1534.4,421.2 			"
            />
            <line
              className="greyStroke"
              x1="1534.4"
              y1="325.2"
              x2="1472.6"
              y2="295.2"
            />
          </g>
          <line
            className="greyStroke"
            x1="1559.5"
            y1="329.1"
            x2="1559.5"
            y2="380.4"
          />
        </g>
        <path
          className="tealStroke"
          d="M1338.2,439l168-46.1c10.3-2.8,14.4-20.1,9.3-38.6s-17.6-31.1-27.8-28.3l-166,43.8"
        />
        <g>
          <polyline
            className="whiteFillGreyStroke"
            points="1338.2,473.6 1338.2,378 1276.4,347.7 1251.3,354.7 1251.3,386 		"
          />
          <polyline
            className="whiteFillGreyStroke"
            points="1338.2,473.6 1313.1,480.7 1251.9,451.7 		"
          />
          <polyline
            className="whiteFillGreyStroke"
            points="1313.1,480.7 1313.1,384.7 1338.2,378 		"
          />
          <line
            className="greyStroke"
            x1="1313.1"
            y1="384.7"
            x2="1251.3"
            y2="354.7"
          />
        </g>
        <path
          className="greyStroke"
          d="M1262.5,455.9c-5.9-4.8-11.3-12.6-14.9-22.1"
        />
        <path
          className="whiteFillGreyStroke"
          d="M1244.2,420.9c-3.1-18.7,2.3-35.1,13.4-38.2c12.5-3.5,27.5,11.2,33.4,32.7s0.6,41.7-11.9,45.2
      c-1.8,0.5-3.7,0.6-5.5,0.4"
        />
        <path
          className="greyStroke"
          d="M1257.6,382.8l15.4-4.8l-1,0.3c11.9-3.3,26.5,11.4,32.4,32.9s1.1,41.6-10.9,44.9l1-0.3l-15.4,4.8"
        />
        <g>
          <ellipse
            transform="matrix(0.9638 -0.2667 0.2667 0.9638 -69.3951 340.2039)"
            className="blueStroke"
            cx="1217.8"
            cy="425.6"
            rx="7.6"
            ry="13"
          />
          <path
            className="whiteFillBlueStroke"
            d="M1241.8,411.5c0.5-1.9,1.6-3.2,3.1-3.6c3.1-0.8,6.7,2.7,8.2,8c1.5,5.2,0.2,10.2-2.9,11
        c-2.6,0.7-5.5-1.7-7.3-5.6"
          />
          <ellipse
            transform="matrix(0.9638 -0.2667 0.2667 0.9638 -69.4787 339.9657)"
            className="blueStroke"
            cx="1216.9"
            cy="425.8"
            rx="5.1"
            ry="8.3"
          />

          <ellipse
            transform="matrix(0.9638 -0.2667 0.2667 0.9638 -69.3951 340.2039)"
            className="blueStroke"
            cx="1217.8"
            cy="425.6"
            rx="2.7"
            ry="4.7"
          />
          <path
            className="blueStroke"
            d="M1244,413.9c0.3-0.3,0.6-0.5,0.9-0.6c1.4-0.4,3.2,1.3,3.9,3.8s0.1,4.8-1.4,5.2c-0.3,0.1-0.6,0.1-0.9,0"
          />
          <path
            className="blueStroke"
            d="M1221.3,438.1l14.2-3.9c4-1.1,5.7-7.6,3.8-14.6c-1.9-6.9-6.7-11.6-10.8-10.5l-14.2,3.9"
          />
          <path
            className="blueStroke"
            d="M1239.7,429.2l3.6-1c2.8-0.8,4-5.3,2.7-10.1c-1.3-4.8-4.7-8.1-7.5-7.3l-3.4,0.9"
          />
          <line
            className="blueStroke"
            x1="1219.2"
            y1="414.2"
            x2="1233.4"
            y2="410.2"
          />
          <line
            className="blueStroke"
            x1="1221.8"
            y1="416.6"
            x2="1236"
            y2="412.7"
          />
          <line
            className="blueStroke"
            x1="1223.7"
            y1="419.7"
            x2="1237.9"
            y2="415.8"
          />
          <line
            className="blueStroke"
            x1="1225.1"
            y1="423"
            x2="1239.3"
            y2="419.1"
          />
          <line
            className="blueStroke"
            x1="1244.9"
            y1="407.9"
            x2="1251.1"
            y2="406.2"
          />
          <line
            className="blueStroke"
            x1="1250.1"
            y1="426.9"
            x2="1256.4"
            y2="425.2"
          />
          <path
            className="blueStroke"
            d="M1251.1,406.2c3.1-0.8,6.7,2.7,8.2,8c1.5,5.2,0.2,10.2-2.9,11"
          />
        </g>
        <path
          className="whiteFillGreyStroke"
          d="M1227.4,425.6l38.2-10.6c2.1-0.6,4.5,1.8,5.5,5.4c1,3.5,0.1,6.8-1.9,7.4l-38.2,10.6"
        />
        <ellipse
          transform="matrix(0.9638 -0.2667 0.2667 0.9638 -70.6921 343.4503)"
          className="whiteFillGreyStroke"
          cx="1229.1"
          cy="432"
          rx="3.9"
          ry="6.6"
        />
        <g>
          <path
            className="whiteFillPinkStroke"
            d="M1270.3,425.3c0.5-1.9,1.6-3.2,3.1-3.6c3.1-0.8,6.7,2.7,8.2,8s0.2,10.2-2.9,11c-1.4,0.4-2.9-0.2-4.3-1.3"
          />
          <path
            className="pinkStroke"
            d="M1272.5,427.7c0.3-0.3,0.6-0.5,0.9-0.6c1.4-0.4,3.2,1.3,3.9,3.8s0.1,4.8-1.4,5.2c-0.3,0.1-0.6,0.1-0.9,0"
          />
          <path
            className="whiteFillPinkStroke"
            d="M1268.2,443l3.6-1c2.8-0.8,4-5.3,2.7-10.1c-1.3-4.8-4.7-8.1-7.5-7.3l-3.4,0.9"
          />
          <path
            className="whiteFillPinkStroke"
            d="M1249.8,452l14.2-3.9c4-1.1,5.7-7.6,3.8-14.6c-1.9-6.9-6.7-11.6-10.8-10.5l-14.2,3.9"
          />
          <line
            className="pinkStroke"
            x1="1247.7"
            y1="428"
            x2="1261.9"
            y2="424.1"
          />
          <line
            className="pinkStroke"
            x1="1250.3"
            y1="430.5"
            x2="1264.5"
            y2="426.6"
          />
          <line
            className="pinkStroke"
            x1="1252.2"
            y1="433.6"
            x2="1266.4"
            y2="429.6"
          />
          <line
            className="pinkStroke"
            x1="1253.6"
            y1="436.9"
            x2="1267.8"
            y2="433"
          />
          <line
            className="pinkStroke"
            x1="1254.3"
            y1="441"
            x2="1268.5"
            y2="437"
          />
          <line
            className="pinkStroke"
            x1="1254.3"
            y1="445.3"
            x2="1268.7"
            y2="441.3"
          />
          <line
            className="pinkStroke"
            x1="1252.9"
            y1="449.6"
            x2="1267.1"
            y2="445.6"
          />
          <line
            className="pinkStroke"
            x1="1273.4"
            y1="421.7"
            x2="1279.6"
            y2="420"
          />
          <line
            className="pinkStroke"
            x1="1278.6"
            y1="440.7"
            x2="1284.9"
            y2="439"
          />
          <path
            className="pinkStroke"
            d="M1279.6,420c3.1-0.8,6.7,2.7,8.2,8s0.2,10.2-2.9,11"
          />
          <ellipse
            transform="matrix(0.9638 -0.2667 0.2667 0.9638 -72.0344 348.3261)"
            className="whiteFillPinkStroke"
            cx="1246.4"
            cy="439.4"
            rx="7.6"
            ry="13"
          />
          <ellipse
            transform="matrix(0.9638 -0.2667 0.2667 0.9638 -72.1391 347.9875)"
            className="pinkStroke"
            cx="1245.1"
            cy="439.6"
            rx="5.4"
            ry="8.5"
          />
          <ellipse
            transform="matrix(0.9638 -0.2667 0.2667 0.9638 -72.048 348.2522)"
            className="pinkStroke"
            cx="1246.1"
            cy="439.4"
            rx="2.9"
            ry="4.8"
          />
        </g>
        <path
          className="greyStroke"
          d="M1262.5,455.9c0,0,3.6,2.5,5.9,3.6s5.2,1.5,5.2,1.5"
        />
        <g
          id="magnet"
          style={{
            transform: `translate(${interpolate(
              -49.3,
              12.2,
              76.32,
              -20.75,
              magnetPosition,
              'px'
            )})`,
          }}
        >
          <g>
            <path
              className="whiteFillBlueStroke"
              d="M1393.9,343v3c0,1.5,2.1,2.7,4.7,2.7s4.7-1.3,4.6-2.8v-3.1"
            />
            <path
              className="whiteFillBlueStroke"
              d="M1389.2,333.5v4.9c0,2.9,4.1,5.2,9.1,5.2c5-0.1,9-2.5,9-5.4v-4.5"
            />
            <path
              className="whiteFillBlueStroke"
              d="M1385.2,313.3l0.2,15.1c0.1,4.2,5.9,7.5,13.1,7.4s13-3.6,12.9-7.7l-0.2-15.1"
            />
            <line
              className="blueStroke"
              x1="1408.9"
              y1="316"
              x2="1409"
              y2="332.5"
            />
            <line
              className="blueStroke"
              x1="1405.8"
              y1="317.3"
              x2="1406"
              y2="334.4"
            />
            <line
              className="blueStroke"
              x1="1402.4"
              y1="318"
              x2="1402.5"
              y2="335.4"
            />
            <line
              className="blueStroke"
              x1="1398.8"
              y1="318.3"
              x2="1399"
              y2="335.9"
            />
            <line
              className="blueStroke"
              x1="1394.7"
              y1="318.1"
              x2="1394.9"
              y2="335.6"
            />
            <line
              className="blueStroke"
              x1="1390.5"
              y1="317.4"
              x2="1390.7"
              y2="334.5"
            />
            <line
              className="blueStroke"
              x1="1386.7"
              y1="315.7"
              x2="1386.9"
              y2="332"
            />
            <ellipse
              transform="matrix(0.9999 -1.256615e-02 1.256615e-02 0.9999 -3.8253 17.5931)"
              className="blueStroke"
              cx="1398.1"
              cy="313.2"
              rx="13"
              ry="5.2"
            />
            <ellipse
              transform="matrix(0.9999 -1.256617e-02 1.256617e-02 0.9999 -3.8139 17.5956)"
              className="blueStroke"
              cx="1398.3"
              cy="312.3"
              rx="8.5"
              ry="3.7"
            />
            <ellipse
              transform="matrix(0.9999 -1.256616e-02 1.256616e-02 0.9999 -3.8227 17.5956)"
              className="blueStroke"
              cx="1398.3"
              cy="313"
              rx="4.8"
              ry="2"
            />
          </g>
          <path className="blackStroke" d="M1385.7,353.7" />
          <path
            className="whiteFillBlackStroke"
            d="M1389.3,425.1l15-4.2c10.3-2.8,14.4-20.2,9.3-38.8c-5.1-18.6-17.6-31.3-27.9-28.5l-14.7,4l0,0
        c2.5-6.8,6.6-11.6,12.2-13.2c13.2-3.7,29.2,12.6,35.8,36.4s1.2,46-12,49.6C1401.2,432,1395,429.9,1389.3,425.1"
          />
          <path
            className="whiteFillBlackStroke"
            d="M1416.1,340.9c9.4,5.3,18.4,18,22.9,34.3c6.6,23.7,1.2,46-12,49.6l-20,5.6c13.2-3.7,18.6-25.9,12-49.6
        s-22.6-40-35.8-36.4l13.1-3.7l14-3.7"
          />
          <g>
            <path
              className="whiteFillPinkStroke"
              d="M1425.9,350.1c3.6,0.6,6.1,2.1,6.1,3.8v5.9c0,2.7-4.4,9-9.8,9s-9.9-6.1-9.9-8.8v-6.3c0-1.6,2.3-2.9,5.6-3.5
          "
            />
            <path
              className="pinkStroke"
              d="M1417.4,350v3c0,1.5,2.1,2.7,4.7,2.7s4.7-1.3,4.6-2.8v-3.1"
            />
            <path
              className="whiteFillPinkStroke"
              d="M1412.6,340.5v4.9c0,2.9,4.1,5.2,9.1,5.2c5-0.1,9-2.5,9-5.4v-4.5"
            />
            <path
              className="whiteFillPinkStroke"
              d="M1408.6,320.3l0.2,15.1c0.1,4.2,5.9,7.5,13.1,7.4s13-3.6,12.9-7.7l-0.2-15.1"
            />
            <line
              className="pinkStroke"
              x1="1432.3"
              y1="323"
              x2="1432.5"
              y2="339.5"
            />
            <line
              className="pinkStroke"
              x1="1429.3"
              y1="324.3"
              x2="1429.5"
              y2="341.4"
            />
            <line
              className="pinkStroke"
              x1="1425.8"
              y1="325"
              x2="1426"
              y2="342.4"
            />
            <line
              className="pinkStroke"
              x1="1422.3"
              y1="325.3"
              x2="1422.5"
              y2="342.9"
            />
            <line
              className="pinkStroke"
              x1="1418.2"
              y1="325.1"
              x2="1418.4"
              y2="342.6"
            />
            <line
              className="pinkStroke"
              x1="1414"
              y1="324.4"
              x2="1414.2"
              y2="341.5"
            />
            <line
              className="pinkStroke"
              x1="1410.2"
              y1="322.7"
              x2="1410.4"
              y2="339"
            />
            <ellipse
              transform="matrix(0.9999 -1.256615e-02 1.256615e-02 0.9999 -3.9114 17.889)"
              className="whiteFillPinkStroke"
              cx="1421.6"
              cy="320.2"
              rx="13"
              ry="5.2"
            />
            <ellipse
              transform="matrix(0.9999 -1.256617e-02 1.256617e-02 0.9999 -3.9 17.8914)"
              className="pinkStroke"
              cx="1421.8"
              cy="319.3"
              rx="8.5"
              ry="3.7"
            />
            <ellipse
              transform="matrix(0.9999 -1.256616e-02 1.256616e-02 0.9999 -3.9088 17.8915)"
              className="pinkStroke"
              cx="1421.8"
              cy="320"
              rx="4.8"
              ry="2"
            />
            <path
              className="pinkStroke"
              d="M1432,353.3c0,2.7-4.4,5-9.8,5c-5.4,0.1-9.9-2.1-9.9-4.8"
            />
          </g>
        </g>
      </g>
      <polyline
        className="whiteFillGreyStroke"
        points="664.9,524.2 492,570.8 577.4,612.5 750.3,565.9 664.9,524.2 "
      />
      <polyline
        className="whiteFillGreyStroke"
        points="577.4,749.2 750.3,702.6 750.3,565.9 577.4,612.5 "
      />
      <polyline
        className="whiteFillGreyStroke"
        points="492,570.8 492,707.5 577.4,749.2 577.4,612.5 492,570.8 "
      />
      <line className="greyStroke" x1="740" y1="565.4" x2="663" y2="527.8" />
      <line className="greyStroke" x1="617.9" y1="540" x2="663" y2="527.8" />
      <ellipse
        className="whiteFillGreyStroke"
        cx="694.9"
        cy="565.9"
        rx="16.9"
        ry="5.9"
      />
      <line
        className="greyStroke"
        x1="683.1"
        y1="580.7"
        x2="606.1"
        y2="543.2"
      />
      <ellipse
        className="whiteFillGreyStroke"
        cx="606.1"
        cy="554.5"
        rx="16.9"
        ry="5.9"
      />
      <ellipse
        className="whiteFillGreyStroke"
        cx="637"
        cy="582.2"
        rx="16.9"
        ry="5.9"
      />
      <ellipse
        className="whiteFillGreyStroke"
        cx="546.6"
        cy="571.4"
        rx="16.9"
        ry="5.9"
      />
      <polyline
        className="greyStroke"
        points="635.4,733.5 635.4,596.9 550,555.2 "
      />
      <line
        className="greyStroke"
        x1="625.1"
        y1="596.3"
        x2="548.1"
        y2="558.8"
      />
      <line className="greyStroke" x1="637" y1="593.1" x2="560" y2="555.6" />
      <line className="greyStroke" x1="502" y1="571.2" x2="548.1" y2="558.8" />
      <line className="greyStroke" x1="560" y1="555.6" x2="606.1" y2="543.2" />
      <path className="greyStroke" d="M664.9,660.9" />
      <path
        className="whiteFillBlueStroke"
        d="M648,532.5v7.4c0,3.3,7.5,5.9,16.9,5.9c9.3,0,16.9-2.7,16.9-5.9v-7.4"
      />
      <ellipse
        className="whiteFillBlueStroke"
        cx="664.9"
        cy="532.5"
        rx="16.9"
        ry="5.9"
      />
      <path className="whiteFillBlueStroke" d="M668.4,523.7" />
      <polyline
        className="whiteFillBlueStroke"
        points="649.6,516.7 649.6,527.3 651.3,531.9 667.2,534 667.2,525.1 667.2,534 681,530.2 681,522 "
      />
      <polyline
        className="whiteFillBlueStroke"
        points="656.6,514.5 649.6,516.7 651.3,522.7 667.2,525.1 681,522 679.3,515.6 672.9,514.8 "
      />
      <line
        className="blueStroke"
        x1="651.3"
        y1="522.7"
        x2="651.3"
        y2="531.9"
      />
      <path className="blueStroke" d="M664.9,524.2" />
      <path className="greyStroke" d="M550,691.9" />
      <path className="greyStroke" d="M550,555.2" />
      <polyline
        className="greyStroke"
        points="693.3,717.9 693.3,581.3 607.9,539.6 "
      />
      <path className="greyStroke" d="M607.9,676.2" />
      <path className="greyStroke" d="M607.9,539.6" />
      <line className="greyStroke" x1="502" y1="571.2" x2="579" y2="608.8" />
      <line className="greyStroke" x1="694.9" y1="577.5" x2="617.9" y2="540" />
      <line className="greyStroke" x1="694.9" y1="577.5" x2="740" y2="565.4" />
      <line className="greyStroke" x1="637" y1="593.1" x2="683.1" y2="580.7" />
      <line className="greyStroke" x1="579" y1="608.8" x2="625.1" y2="596.3" />
      <g>
        <polygon
          className="whiteFillGreyStroke"
          points="528.3,552.6 518.6,563.7 518.6,568.5 522.3,571.4 647.4,586 654.9,585 664.3,575.5 664.3,569.3 
      659.6,566.2 533.4,551.3 	"
        />
        <polyline
          className="greyStroke"
          points="519.3,562.8 522.3,565.1 647.4,579.7 654.9,578.8 664.3,569.3 	"
        />
        <line
          className="greyStroke"
          x1="522.3"
          y1="565.1"
          x2="522.3"
          y2="571.4"
        />
        <line
          className="greyStroke"
          x1="647.4"
          y1="579.7"
          x2="647.4"
          y2="586"
        />
        <line
          className="greyStroke"
          x1="654.9"
          y1="578.8"
          x2="654.9"
          y2="585"
        />
      </g>
      <g>
        <polygon
          className="whiteFillGreyStroke"
          points="590,535.7 580.2,546.8 580.2,551.6 583.9,554.5 709,569.1 716.5,568.1 725.9,558.7 725.9,552.4 
      721.2,549.3 595,534.4 	"
        />
        <polyline
          className="greyStroke"
          points="581,545.9 583.9,548.3 709,562.9 716.5,561.9 725.9,552.4 	"
        />
        <line
          className="greyStroke"
          x1="583.9"
          y1="548.3"
          x2="583.9"
          y2="554.5"
        />
        <line className="greyStroke" x1="709" y1="562.9" x2="709" y2="569.1" />
        <line
          className="greyStroke"
          x1="716.5"
          y1="561.9"
          x2="716.5"
          y2="568.1"
        />
      </g>
      <polyline
        className="whiteFillGreyStroke"
        points="531.3,548.2 531.3,558.8 532.9,563.4 548.9,565.5 548.9,556.6 548.9,565.5 562.6,561.7 562.6,553.5 
    "
      />
      <polyline
        className="whiteFillGreyStroke"
        points="538.3,546 531.3,548.2 532.9,554.2 548.9,556.6 562.6,553.5 561,547.1 554.5,546.3 "
      />
      <ellipse
        className="whiteFillGreyStroke"
        cx="546.6"
        cy="545.4"
        rx="7.6"
        ry="2.7"
      />
      <path
        className="greyStroke"
        d="M538.9,545.4v5.4c0,1.5,3.4,2.7,7.6,2.7c4.2,0,7.6-1.2,7.6-2.7v-5.4"
      />
      <line
        className="greyStroke"
        x1="532.9"
        y1="554.2"
        x2="532.9"
        y2="563.4"
      />
      <path className="tealStroke" d="M640.4,566" />
      <polyline
        className="whiteFillGreyStroke"
        points="621.7,559 621.7,569.5 623.4,574.2 639.3,576.3 639.3,567.4 639.3,576.3 653.1,572.5 653.1,564.2 "
      />
      <polyline
        className="whiteFillGreyStroke"
        points="628.7,556.8 621.7,559 623.4,565 639.3,567.4 653.1,564.2 651.4,557.9 645,557.1 "
      />
      <ellipse
        className="whiteFillGreyStroke"
        cx="637"
        cy="556.2"
        rx="7.6"
        ry="2.7"
      />
      <path
        className="greyStroke"
        d="M629.4,556.2v5.4c0,1.5,3.4,2.7,7.6,2.7c4.2,0,7.6-1.2,7.6-2.7v-5.4"
      />
      <line className="greyStroke" x1="623.4" y1="565" x2="623.4" y2="574.2" />
      <path className="greyStroke" d="M609.5,538.3" />
      <polyline
        className="whiteFillGreyStroke"
        points="590.8,531.3 590.8,541.9 592.4,546.5 608.4,548.6 608.4,539.7 608.4,548.6 622.2,544.8 622.2,536.6 
    "
      />
      <polyline
        className="whiteFillGreyStroke"
        points="597.8,529.1 590.8,531.3 592.4,537.4 608.4,539.7 622.2,536.6 620.5,530.2 614,529.4 "
      />
      <ellipse
        className="whiteFillGreyStroke"
        cx="606.1"
        cy="528.6"
        rx="7.6"
        ry="2.7"
      />
      <path
        className="greyStroke"
        d="M598.4,528.6v5.4c0,1.5,3.4,2.7,7.6,2.7c4.2,0,7.6-1.2,7.6-2.7v-5.4"
      />
      <line
        className="greyStroke"
        x1="592.4"
        y1="537.4"
        x2="592.4"
        y2="546.5"
      />
      <path className="greyStroke" d="M698.4,549.7" />
      <polyline
        className="whiteFillGreyStroke"
        points="679.6,542.7 679.6,553.2 681.3,557.9 697.2,560 697.2,551.1 697.2,560 711,556.2 711,547.9 "
      />
      <polyline
        className="whiteFillGreyStroke"
        points="686.6,540.5 679.6,542.7 681.3,548.7 697.2,551.1 711,547.9 709.3,541.6 702.9,540.8 "
      />
      <ellipse
        className="whiteFillGreyStroke"
        cx="694.9"
        cy="539.9"
        rx="7.6"
        ry="2.7"
      />
      <path
        className="greyStroke"
        d="M687.3,539.9v5.4c0,1.5,3.4,2.7,7.6,2.7s7.6-1.2,7.6-2.7v-5.4"
      />
      <line
        className="greyStroke"
        x1="681.3"
        y1="548.7"
        x2="681.3"
        y2="557.9"
      />
      <g>
        <path
          className="whiteFillPinkStroke"
          d="M560,590v7.4c0,3.3,7.5,5.9,16.9,5.9c9.3,0,16.9-2.7,16.9-5.9V590"
        />
        <ellipse
          className="pinkStroke"
          cx="576.8"
          cy="590"
          rx="16.9"
          ry="5.9"
        />
        <path className="pinkStroke" d="M580.3,581.2" />
        <polyline
          className="whiteFillPinkStroke"
          points="561.6,574.1 561.6,584.7 563.2,589.4 579.1,591.4 579.1,582.5 579.1,591.4 592.9,587.7 592.9,579.4 
        "
        />
        <polyline
          className="whiteFillPinkStroke"
          points="568.6,572 561.6,574.1 563.2,580.2 579.1,582.5 592.9,579.4 591.3,573.1 584.8,572.3 	"
        />
        <ellipse
          className="whiteFillPinkStroke"
          cx="576.8"
          cy="571.4"
          rx="7.6"
          ry="2.7"
        />
        <path
          className="pinkStroke"
          d="M569.2,571.4v5.4c0,1.5,3.4,2.7,7.6,2.7c4.2,0,7.6-1.2,7.6-2.7v-5.4"
        />
        <line
          className="pinkStroke"
          x1="563.2"
          y1="580.2"
          x2="563.2"
          y2="589.4"
        />
      </g>
      <path
        className="whiteFillBlueStroke"
        d="M657.3,513.9v5.4c0,1.5,3.4,2.7,7.6,2.7c4.2,0,7.6-1.2,7.6-2.7v-5.4"
      />
      <ellipse
        className="whiteFillBlueStroke"
        cx="664.9"
        cy="513.9"
        rx="7.6"
        ry="2.7"
      />
      <g className="blackFill">
        <path d="M593.5,618.6l1.9-0.5v5.2l5.2-1.4v1.9l-5.2,1.4v5.2l-1.9,0.5v-5.2l-5.2,1.4v-1.9l5.2-1.4V618.6z" />
        <path d="M728.5,585.3l7.4-2v2.5l-7.4,2V585.3z" />
      </g>
      <g>
        <polyline
          className="whiteFillGreyStroke"
          points="932.3,566.1 921.2,568.7 909.9,562.9 904.4,552.7 904.4,552.7 904.4,538.4 1108.2,521.6 
      1108.2,535.9 954.2,576.6 904.4,552.7 	"
        />
        <polygon
          className="whiteFillGreyStroke"
          points="904.4,538.4 954.2,562.3 1108.2,521.6 1058.4,497.8 	"
        />
        <g
          id="switch"
          style={{
            transition: 'transform .2s ease-in-out',
            transformOrigin: '957.3px 529px',
            transform: `rotate(${toggle ? 0 : -20}deg)`,
          }}
        >
          <path
            className="whiteFillBlackStroke"
            d="M1052.9,487.9l6.5-3.1c3.1-0.9,6.9,2.7,8.4,8.1c1.6,5.4,0.3,10.5-2.7,11.4l-7.3,0.5"
          />
          <path
            className="whiteFillBlackStroke"
            d="M1032.3,493.4l20.7-5.5c2.7-0.8,5.9,2.4,7.3,7s0.3,9.1-2.4,9.8l-20.7,5.5"
          />
          <path
            className="whiteFillBlackStroke"
            d="M1024.5,519.3l7.9-2.3c4.3-1.3,6-8.4,3.8-15.9s-7.5-12.6-11.8-11.3l-7.9,2.3"
          />
          <path
            className="blackStroke"
            d="M1032.6,493.6c2.3,0.5,4.7,3.3,5.8,7.1c1.2,4,0.6,7.8-1.3,9.3"
          />
          <polyline
            className="blackStroke"
            points="947.7,517.9 944.5,522 944.3,527.2 949.2,529.8 		"
          />
          <line
            className="blackStroke"
            x1="949.2"
            y1="524.5"
            x2="944.5"
            y2="522"
          />
          <polyline
            className="blackStroke"
            points="944.3,527.2 946.9,529.5 951.9,532.2 		"
          />

          <ellipse
            transform="matrix(0.9598 -0.2807 0.2807 0.9598 -100.9396 306.8204)"
            className="whiteFillBlackStroke"
            cx="1020.6"
            cy="505.8"
            rx="8.1"
            ry="14.2"
          />
          <polyline
            className="whiteFillBlackStroke"
            points="951.9,520.5 947.7,517.9 1018.4,499.1 1023.7,501.4 		"
          />
          <polygon
            className="whiteFillBlackStroke"
            points="951.9,532.2 1023.7,513.1 1023.7,501.4 951.9,520.5 949.2,524.5 949.2,529.8 		"
          />
        </g>
        <path
          className="whiteFillGreyStroke"
          d="M966,520l-10.4-5.6c-6.5-3.8-15.6-0.1-20.4,8.2c-3,5.2-3.6,10.7-2.1,15.2l10.4,5.6l27.9-7.4"
        />
        <line
          className="greyStroke"
          x1="954.2"
          y1="562.3"
          x2="954.2"
          y2="576.6"
        />
        <polyline
          className="greyStroke"
          points="1073.5,554.6 1102.2,547 1108.2,535.9 	"
        />
        <line
          className="greyStroke"
          x1="956.6"
          y1="586.1"
          x2="987.7"
          y2="577.3"
        />
        <polyline
          className="greyStroke"
          points="1069.7,546.1 1073.5,554.6 1061.3,548.3 	"
        />
        <line
          className="greyStroke"
          x1="993.8"
          y1="566.1"
          x2="987.7"
          y2="577.3"
        />
        <polyline
          className="greyStroke"
          points="954.2,576.6 956.6,586.1 945.4,580 941.9,570.7 	"
        />
        <g>
          <path
            className="blueStroke"
            d="M1036.3,521.7v4.9c0,2.9,4.1,5.2,9.1,5.2c5-0.1,9-2.5,9-5.4v-4.5"
          />
          <path
            className="whiteFillBlueStroke"
            d="M1032.3,504.5l0.2,15.1c0.1,4.2,5.9,7.5,13.1,7.4s13-3.6,12.9-7.7l-0.2-15.1"
          />
          <line
            className="blueStroke"
            x1="1056"
            y1="507.2"
            x2="1056.2"
            y2="523.7"
          />
          <line
            className="blueStroke"
            x1="1052.9"
            y1="508.5"
            x2="1053.1"
            y2="525.6"
          />
          <line
            className="blueStroke"
            x1="1049.5"
            y1="509.2"
            x2="1049.6"
            y2="526.6"
          />
          <line
            className="blueStroke"
            x1="1045.9"
            y1="509.5"
            x2="1046.1"
            y2="527.1"
          />
          <line
            className="blueStroke"
            x1="1041.8"
            y1="509.3"
            x2="1042"
            y2="526.8"
          />
          <line
            className="blueStroke"
            x1="1037.6"
            y1="508.6"
            x2="1037.8"
            y2="525.7"
          />
          <line
            className="blueStroke"
            x1="1033.8"
            y1="506.9"
            x2="1034"
            y2="523.2"
          />

          <ellipse
            transform="matrix(0.9999 -1.256615e-02 1.256615e-02 0.9999 -6.2557 13.1737)"
            className="whiteFillBlueStroke"
            cx="1045.2"
            cy="504.4"
            rx="13"
            ry="5.2"
          />

          <ellipse
            transform="matrix(0.9999 -1.256617e-02 1.256617e-02 0.9999 -6.2444 13.1762)"
            className="blueStroke"
            cx="1045.4"
            cy="503.5"
            rx="8.5"
            ry="3.7"
          />

          <ellipse
            transform="matrix(0.9999 -1.256616e-02 1.256616e-02 0.9999 -6.2532 13.1762)"
            className="blueStroke"
            cx="1045.4"
            cy="504.2"
            rx="4.8"
            ry="2"
          />
        </g>
        <path
          className="greyStroke"
          d="M971.4,536.1l-27.9,7.4c-1.6-4.5-0.9-10,2.1-15.2c4.8-8.3,13.9-12,20.4-8.2c4.9,2.8,6.9,9,5.6,15.4"
        />
        <g>
          <path
            className="blueStroke"
            d="M970.6,539.4v4.9c0,2.9,4.1,5.2,9.1,5.2s9-2.5,9-5.4v-4.5"
          />
          <path
            className="whiteFillBlueStroke"
            d="M966.6,522.2l0.2,15.1c0.1,4.2,5.9,7.5,13.1,7.4c7.2-0.1,13-3.6,12.9-7.7l-0.2-15.1"
          />
          <line
            className="blueStroke"
            x1="990.3"
            y1="524.9"
            x2="990.4"
            y2="541.4"
          />
          <line
            className="blueStroke"
            x1="987.2"
            y1="526.1"
            x2="987.4"
            y2="543.3"
          />
          <line
            className="blueStroke"
            x1="983.8"
            y1="526.9"
            x2="983.9"
            y2="544.3"
          />
          <line
            className="blueStroke"
            x1="980.2"
            y1="527.2"
            x2="980.4"
            y2="544.7"
          />
          <line
            className="blueStroke"
            x1="976.1"
            y1="527"
            x2="976.3"
            y2="544.5"
          />
          <line
            className="blueStroke"
            x1="971.9"
            y1="526.3"
            x2="972.1"
            y2="543.3"
          />
          <line
            className="blueStroke"
            x1="968.1"
            y1="524.6"
            x2="968.3"
            y2="540.8"
          />

          <ellipse
            transform="matrix(0.9999 -1.256615e-02 1.256615e-02 0.9999 -6.4821 12.3495)"
            className="whiteFillBlueStroke"
            cx="979.5"
            cy="522"
            rx="13"
            ry="5.2"
          />

          <ellipse
            transform="matrix(0.9999 -1.256617e-02 1.256617e-02 0.9999 -6.472 12.352)"
            className="blueStroke"
            cx="979.7"
            cy="521.2"
            rx="8.5"
            ry="3.7"
          />

          <ellipse
            transform="matrix(0.9999 -1.256616e-02 1.256616e-02 0.9999 -6.4808 12.352)"
            className="blueStroke"
            cx="979.7"
            cy="521.9"
            rx="4.8"
            ry="2"
          />
        </g>
      </g>
      <g id="meter_00000134250950395262143030000014948451311822133149_">
        <polygon
          className="whiteFillBlueStroke"
          points="500.8,107.9 501.8,336.3 491,347.1 491,401.5 484.2,408.3 484.2,414.2 579.6,460.2 582.4,461.7 
      816.7,399 822.4,395 822.4,390.8 815.6,383.2 815.6,328.7 806.2,319.2 806.2,89.5 809.1,88.9 811.3,84.9 805.5,78.1 805.5,66.5 
      719.6,24.8 501.8,84.1 501.8,95.5 496.2,102.3 496.7,105.3 	"
        />
        <line
          className="blueStroke"
          x1="815.6"
          y1="383.2"
          x2="760.7"
          y2="397.8"
        />
        <line
          className="blueStroke"
          x1="734.3"
          y1="404.8"
          x2="668.7"
          y2="422.3"
        />
        <polyline
          className="blueStroke"
          points="614.3,276.7 596.5,281.5 596.5,255.5 	"
        />
        <line
          className="blueStroke"
          x1="685.5"
          y1="231.2"
          x2="703"
          y2="226.5"
        />
        <line
          className="blueStroke"
          x1="737.4"
          y1="243.2"
          x2="685.8"
          y2="257.2"
        />
        <line
          className="blueStroke"
          x1="668.5"
          y1="317.2"
          x2="630.3"
          y2="327.3"
        />
        <polyline
          className="greyStroke"
          points="668.5,307.9 668.5,317.3 678.5,321.7 678.5,297.9 	"
        />
        <polyline
          className="greyStroke"
          points="678.5,321.7 680.6,321 680.6,297.3 	"
        />
        <polyline
          className="greyStroke"
          points="618.1,308.2 618.1,331.4 628,335.7 628,312 	"
        />
        <polyline
          className="greyStroke"
          points="628,335.7 630.2,335.1 630.2,311.4 	"
        />
        <line
          className="greyStroke"
          x1="634.7"
          y1="307.7"
          x2="648.2"
          y2="303.9"
        />
        <path
          className="greyStroke"
          d="M634.7,293.6l7.1,3.8c0,0,3,5.1,6.4,6.6"
        />
        <line
          className="greyStroke"
          x1="634.7"
          y1="299.3"
          x2="641.8"
          y2="297.3"
        />
        <polyline
          className="pinkStroke"
          points="627,312.3 627,233.4 685.7,217 	"
        />
        <polyline
          className="pinkStroke"
          points="677.6,298.2 685.7,295.9 685.7,217 667,207.4 608.4,226.5 608.4,252.3 608.4,272.8 614.6,276.6 
      614.6,306.6 627,312.3 651.9,305.4 	"
        />
        <path
          className="whiteFillGreyStroke"
          d="M775.2,183.9L775,206l-28.9,7.9c-15-15.4-37.5-21.6-62.6-14.8c-25.2,6.9-47.9,25.4-63.3,49.2
      c0,0-15.6,4.3-23.9,6.5l0.3-67.9l179.7-28.5L775.2,183.9z"
        />
        <path
          className="whiteFillGreyStroke"
          d="M782.4,182.1V95.8l-185.9,49.5v85.9l18.4-4.9c18.9-24.4,45.3-43.4,74.5-51.1c29.2-7.7,55.6-2.7,74.5,11.7
      L782.4,182.1"
        />
        <polyline
          className="blueStroke"
          points="501.8,84.1 587.8,125.8 805.5,66.5 	"
        />
        <polyline
          className="blueStroke"
          points="491,401.5 582,445.4 582,391.3 491,347.1 	"
        />
        <polyline
          className="blueStroke"
          points="582,391.3 587.8,377.6 501.8,336.3 	"
        />
        <polyline
          className="blueStroke"
          points="643.3,429.1 582,445.4 579.9,454.9 579.6,460.2 	"
        />
        <line
          className="blueStroke"
          x1="822.4"
          y1="390.8"
          x2="579.9"
          y2="454.9"
        />
        <line
          className="blueStroke"
          x1="484.2"
          y1="408.3"
          x2="579.9"
          y2="454.9"
        />
        <line
          className="blueStroke"
          x1="587.8"
          y1="137.3"
          x2="587.8"
          y2="125.8"
        />
        <polyline
          className="blueStroke"
          points="806.2,319.2 587.8,377.6 587.8,147.4 	"
        />
        <line
          className="blueStroke"
          x1="582"
          y1="391.3"
          x2="815.6"
          y2="328.7"
        />
        <polyline
          className="blueStroke"
          points="501.8,95.5 587.8,137.3 805.5,78.1 	"
        />
        <polyline
          className="blueStroke"
          points="500.8,107.9 584.7,148.2 806.2,89.5 	"
        />
        <line
          className="blueStroke"
          x1="596.5"
          y1="145.4"
          x2="596.5"
          y2="375.3"
        />
        <polyline
          className="blueStroke"
          points="743.3,211.2 743.3,297.3 794.7,322.3 794.7,92.5 	"
        />
        <line
          className="blueStroke"
          x1="617.9"
          y1="330.6"
          x2="596.5"
          y2="336.3"
        />
        <line
          className="greyStroke"
          x1="743.3"
          y1="297.3"
          x2="680.6"
          y2="314"
        />
        <polyline
          className="blueStroke"
          points="703,196.3 703,226.5 737.4,243.2 737.4,206.4 	"
        />
        <path className="blackStroke" d="M608.8,252.2" />
        <polyline
          className="greyStroke"
          points="634.9,271.1 666.4,262.5 666.4,277.6 	"
        />
        <ellipse
          transform="matrix(0.5 -0.866 0.866 0.5 77.7337 723.3104)"
          className="greyStroke"
          cx="665.3"
          cy="294.3"
          rx="6.5"
          ry="5.4"
        />
        <ellipse
          transform="matrix(0.5 -0.866 0.866 0.5 77.7337 723.3104)"
          className="greyStroke"
          cx="665.3"
          cy="294.3"
          rx="9.3"
          ry="7.8"
        />
        <ellipse
          transform="matrix(0.5 -0.866 0.866 0.5 77.7337 723.3104)"
          className="greyStroke"
          cx="665.3"
          cy="294.3"
          rx="11.2"
          ry="9.3"
        />
        <ellipse
          transform="matrix(0.5 -0.866 0.866 0.5 77.7337 723.3104)"
          className="greyStroke"
          cx="665.3"
          cy="294.3"
          rx="15.4"
          ry="12.8"
        />
        <line
          className="greyStroke"
          x1="673.5"
          y1="281.3"
          x2="652.8"
          y2="270.5"
        />
        <path className="greyStroke" d="M634.9,277.1c4-7,12.1-10,17.9-6.6" />
        <polyline
          className="pinkStroke"
          points="634.7,310.1 634.7,293.6 634.7,264.1 677,252.4 677,285 	"
        />
        <line
          className="greyStroke"
          x1="648.2"
          y1="303.9"
          x2="657.6"
          y2="307.6"
        />
        <path
          className="blueStroke"
          d="M622.8,403.4c0-4.4-1.9-8.5-5.5-10.5c-5.8-3.3-13.7-0.4-17.7,6.5s-2.6,15.3,3.2,18.6c3.8,2.2,8.4,1.7,12.3-0.8
      l1-0.5"
        />
        <path
          className="blueStroke"
          d="M615.2,416.4c-2.3,1.1-4.7,1.2-6.6,0.1c-3.8-2.2-4.3-8.2-1.2-13.6c3.1-5.3,8.6-7.9,12.4-5.7
      c2.1,1.2,3.2,3.5,3.2,6.3"
        />
        <path
          className="blueStroke"
          d="M615.6,416.5c-0.4-0.1-0.7-0.2-1.1-0.4c-2.7-1.5-3.2-5.7-1.1-9.3s5.9-5.2,8.6-3.7s3.2,5.7,1.1,9.3
      C621.3,415.6,618.1,417.2,615.6,416.5"
        />
        <line
          className="blueStroke"
          x1="622"
          y1="403.1"
          x2="612.9"
          y2="397.5"
        />
        <line
          className="blueStroke"
          x1="614.5"
          y1="416.1"
          x2="605.4"
          y2="410.5"
        />
        <path
          className="pinkStroke"
          d="M667.9,419.1c0-4.4-1.9-8.5-5.5-10.5c-5.8-3.3-13.7-0.4-17.7,6.5s-2.6,15.3,3.2,18.6
      c3.8,2.2,8.4,1.7,12.3-0.8l1-0.5"
        />
        <path
          className="pinkStroke"
          d="M660.2,432.1c-2.3,1.1-4.7,1.2-6.6,0.1c-3.8-2.2-4.3-8.2-1.2-13.6c3.1-5.3,8.6-7.9,12.4-5.7
      c2.1,1.2,3.2,3.5,3.2,6.3"
        />
        <path
          className="pinkStroke"
          d="M660.6,432.2c-0.4-0.1-0.7-0.2-1.1-0.4c-2.7-1.5-3.2-5.7-1.1-9.3s5.9-5.2,8.6-3.7s3.2,5.7,1.1,9.3
      C666.4,431.2,663.2,432.9,660.6,432.2"
        />
        <line
          className="pinkStroke"
          x1="667.1"
          y1="418.8"
          x2="657.9"
          y2="413.2"
        />
        <line
          className="pinkStroke"
          x1="659.6"
          y1="431.8"
          x2="650.4"
          y2="426.2"
        />
        <path
          className="blueStroke"
          d="M713.5,379.2c0-4.4-1.9-8.5-5.5-10.5c-5.8-3.3-13.7-0.4-17.7,6.5s-2.6,15.3,3.2,18.6c3.8,2.2,8.4,1.7,12.3-0.8
      l1-0.5"
        />
        <path
          className="blueStroke"
          d="M705.8,392.2c-2.3,1.1-4.7,1.2-6.6,0.1c-3.8-2.2-4.3-8.2-1.2-13.6c3.1-5.3,8.6-7.9,12.4-5.7
      c2.1,1.2,3.2,3.5,3.2,6.3"
        />
        <path
          className="blueStroke"
          d="M706.2,392.4c-0.4-0.1-0.7-0.2-1.1-0.4c-2.7-1.5-3.2-5.7-1.1-9.3s5.9-5.2,8.6-3.7c2.7,1.5,3.2,5.7,1.1,9.3
      C711.9,391.4,708.8,393.1,706.2,392.4"
        />
        <line
          className="blueStroke"
          x1="712.6"
          y1="379"
          x2="703.5"
          y2="373.3"
        />
        <line
          className="blueStroke"
          x1="705.1"
          y1="391.9"
          x2="696"
          y2="386.3"
        />
        <path
          className="blueStroke"
          d="M803.4,354.9c0-4.4-1.9-8.5-5.5-10.5c-5.8-3.3-13.7-0.4-17.7,6.5s-2.6,15.3,3.2,18.6c3.8,2.2,8.4,1.7,12.3-0.8
      l1-0.5"
        />
        <path
          className="blueStroke"
          d="M795.8,368c-2.3,1.1-4.7,1.2-6.6,0.1c-3.8-2.2-4.3-8.2-1.2-13.6c3.1-5.3,8.6-7.9,12.4-5.7
      c2.1,1.2,3.2,3.5,3.2,6.3"
        />
        <path
          className="blueStroke"
          d="M796.2,368.1c-0.4-0.1-0.7-0.2-1.1-0.4c-2.7-1.5-3.2-5.7-1.1-9.3c2.1-3.6,5.9-5.2,8.6-3.7
      c2.7,1.5,3.2,5.7,1.1,9.3C801.9,367.1,798.7,368.8,796.2,368.1"
        />
        <line
          className="blueStroke"
          x1="802.6"
          y1="354.7"
          x2="793.5"
          y2="349.1"
        />
        <line
          className="blueStroke"
          x1="795.1"
          y1="367.7"
          x2="786"
          y2="362.1"
        />
        <path
          className="pinkStroke"
          d="M759.2,394.6c0-4.4-1.9-8.5-5.5-10.5c-5.8-3.3-13.7-0.4-17.7,6.5s-2.6,15.3,3.2,18.6
      c3.8,2.2,8.4,1.7,12.3-0.8l1-0.5"
        />
        <path
          className="pinkStroke"
          d="M751.5,407.6c-2.3,1.1-4.7,1.2-6.6,0.1c-3.8-2.2-4.3-8.2-1.2-13.6c3.1-5.3,8.6-7.9,12.4-5.7
      c2.1,1.2,3.2,3.5,3.2,6.3"
        />
        <path
          className="pinkStroke"
          d="M751.9,407.8c-0.4-0.1-0.7-0.2-1.1-0.4c-2.7-1.5-3.2-5.7-1.1-9.3c2.1-3.6,5.9-5.2,8.6-3.7
      c2.7,1.5,3.2,5.7,1.1,9.3C757.7,406.8,754.5,408.4,751.9,407.8"
        />
        <line
          className="pinkStroke"
          x1="758.4"
          y1="394.3"
          x2="749.2"
          y2="388.7"
        />
        <line
          className="pinkStroke"
          x1="750.9"
          y1="407.3"
          x2="741.7"
          y2="401.7"
        />
        <line
          className="greyStroke"
          x1="666.4"
          y1="262.5"
          x2="657.6"
          y2="257.8"
        />
        <line
          className="blackStroke"
          x1="689.4"
          y1="175.3"
          x2="689.4"
          y2="158.3"
        />
        <line
          className="blackStroke"
          x1="680.4"
          y1="178.1"
          x2="679.3"
          y2="166.6"
        />
        <line
          className="blackStroke"
          x1="671.3"
          y1="181.6"
          x2="668.4"
          y2="165.7"
        />
        <line
          className="blackStroke"
          x1="662.5"
          y1="185.9"
          x2="659.5"
          y2="175.8"
        />
        <line className="blackStroke" x1="653.8" y1="191" x2="648" y2="176.6" />
        <line
          className="blackStroke"
          x1="645.4"
          y1="196.7"
          x2="640.6"
          y2="187.7"
        />
        <line
          className="blackStroke"
          x1="637.3"
          y1="203"
          x2="628.9"
          y2="190.6"
        />
        <line
          className="blackStroke"
          x1="622.5"
          y1="217.4"
          x2="611.6"
          y2="207.3"
        />
        <line
          className="blackStroke"
          x1="756.4"
          y1="181.9"
          x2="767.3"
          y2="166.1"
        />
        <line
          className="blackStroke"
          x1="630.5"
          y1="209.6"
          x2="624"
          y2="202.1"
        />
        <line
          className="blackStroke"
          x1="698.5"
          y1="173.3"
          x2="699.5"
          y2="161.3"
        />
        <line
          className="blackStroke"
          x1="707.5"
          y1="172.1"
          x2="710.5"
          y2="154.6"
        />
        <line
          className="blackStroke"
          x1="716.4"
          y1="171.7"
          x2="719.3"
          y2="160"
        />
        <line
          className="blackStroke"
          x1="725.1"
          y1="172.1"
          x2="730.9"
          y2="154.7"
        />
        <line
          className="blackStroke"
          x1="733.5"
          y1="173.4"
          x2="738.3"
          y2="161.8"
        />
        <line
          className="blackStroke"
          x1="741.5"
          y1="175.4"
          x2="750"
          y2="158.5"
        />
        <line
          className="blackStroke"
          x1="749.2"
          y1="178.3"
          x2="755.7"
          y2="167.3"
        />
        <path
          className="blackFill"
          d="M685.1,142.6c0-1.6,0.5-3,1.5-4.1s2.1-1.8,3.4-2.2c1.4-0.4,2.5-0.2,3.5,0.4c1,0.6,1.5,1.7,1.5,3.3v7.7c0,1.6-0.5,3-1.5,4.1
      s-2.1,1.9-3.5,2.2c-1.3,0.3-2.5,0.2-3.4-0.4c-1-0.6-1.5-1.7-1.5-3.3V142.6z M692.5,140.8c0-1.7-0.9-2.4-2.5-2
      c-1.6,0.5-2.4,1.6-2.4,3.3v7.4c0,1.8,0.8,2.4,2.4,2c1.6-0.4,2.4-1.5,2.5-3.3V140.8z"
        />
        <path
          className="pinkFill"
          d="M646.1,240.6l2.2-0.6v6.4c0,0.7,0.2,1.2,0.6,1.5c0.4,0.3,0.9,0.4,1.5,0.2s1.1-0.5,1.5-1s0.6-1.1,0.6-1.9v-6.4
      l2.2-0.6V249l-2.2,0.6v-1.2l0,0c-0.7,1-1.6,1.7-2.8,2c-0.9,0.2-1.7,0.1-2.4-0.3c-0.8-0.4-1.2-1.2-1.2-2.5L646.1,240.6L646.1,240.6z
      "
        />
        <path
          className="pinkFill"
          d="M665.5,242.9l-5.8,1.5l-1.2,3.7l-2.4,0.6l5.5-16.6l1.9-0.5l5.5,13.7l-2.4,0.6L665.5,242.9z M664.9,241
      l-2.2-6.1l0,0l-2.2,7.2L664.9,241z"
        />
        <path
          className="blackFill"
          d="M732.9,132.7l9.3-2.5v2.5l-7,1.8v4c0.8-0.9,1.7-1.4,2.8-1.7c0.7-0.2,1.3-0.2,1.8-0.1c0.5,0.1,1,0.3,1.3,0.6
      c0.5,0.4,0.8,0.8,1.1,1.4c0.1,0.3,0.2,0.7,0.2,1.2s0.1,1.1,0.1,1.8c0,1.1-0.1,2-0.2,2.7c-0.2,0.6-0.4,1.2-0.8,1.8
      c-0.3,0.5-0.8,1.1-1.5,1.6c-0.6,0.6-1.4,1-2.3,1.2c-1.2,0.3-2.3,0.2-3.2-0.2c-1-0.5-1.6-1.5-1.9-3l2.5-0.7c0.3,1.3,1.1,1.7,2.5,1.4
      c0.6-0.2,1.1-0.4,1.4-0.7c0.3-0.3,0.6-0.7,0.7-1.1c0.1-0.4,0.2-0.8,0.3-1.3c0-0.4,0-0.9,0-1.3c0-1-0.1-1.8-0.5-2.3
      c-0.2-0.2-0.4-0.4-0.8-0.5c-0.3-0.1-0.8,0-1.3,0.1s-0.9,0.3-1.2,0.6c-0.4,0.3-0.7,0.8-1,1.4l-2.4,0.6v-9.3H732.9z"
        />
        <path className="blackFill" d="M628.4,169.8l7.4-2v2.5l-7.4,2V169.8z" />
        <path
          className="blackFill"
          d="M638.3,157.8l9.3-2.5v2.5l-7,1.8v4c0.8-0.9,1.7-1.4,2.8-1.7c0.7-0.2,1.3-0.2,1.8-0.1c0.5,0.1,1,0.3,1.3,0.6
      c0.5,0.4,0.8,0.8,1.1,1.4c0.1,0.3,0.2,0.7,0.2,1.2s0.1,1.1,0.1,1.8c0,1.1-0.1,2-0.2,2.7c-0.2,0.6-0.4,1.2-0.8,1.8
      c-0.3,0.5-0.8,1.1-1.5,1.6c-0.6,0.6-1.4,1-2.3,1.2c-1.2,0.3-2.3,0.2-3.2-0.2c-1-0.5-1.6-1.5-1.9-3l2.5-0.7c0.3,1.3,1.1,1.7,2.5,1.4
      c0.6-0.2,1.1-0.4,1.4-0.7c0.3-0.3,0.6-0.7,0.7-1.1c0.1-0.4,0.2-0.8,0.3-1.3c0-0.4,0-0.9,0-1.3c0-1-0.1-1.8-0.5-2.3
      c-0.2-0.2-0.4-0.4-0.8-0.5c-0.3-0.1-0.8,0-1.3,0.1s-0.9,0.3-1.2,0.6c-0.4,0.3-0.7,0.8-1,1.4l-2.4,0.6v-9.3H638.3z"
        />
        <path
          className="blackFill"
          d="M769,146l1.9-0.5v5.2l5.2-1.4v1.9l-5.2,1.4v5.2l-1.9,0.5v-5.2l-5.2,1.4v-1.9l5.2-1.4V146z"
        />
        <path className="blackFill" d="M604.9,194.3l7.4-2v2.5l-7.4,2V194.3z" />
        <line
          className="blackStroke"
          x1="665.3"
          y1="294.3"
          x2="690.1"
          y2="308"
        />
        <line
          className="pinkStroke"
          x1="634.7"
          y1="264.1"
          x2="634.7"
          y2="293.6"
        />
        <polyline
          className="blueStroke"
          points="587.8,137.3 584.7,145.4 584.7,148.2 	"
        />
        <g
          id="arrow"
          className="blackFill"
          style={{
            transition: 'transform .3s ease-in-out',
            transformOrigin: '690.1px 308px',
            transform: `rotate(${(magnetDelta ?? 0) * 20}deg) scale(${
              magnetDelta < 0 ? 0.85 : 1
            })`,
          }}
        >
          <path d="M690.1,162c0,0-1.6,13.2-5.2,19.1l4.4,4.3l0.8,0.1l0.8-0.1l4.4-4.3C691.7,175.2,690.1,162,690.1,162z" />
          <line
            className="thickBlackStroke"
            x1="690.1"
            y1="180.4"
            x2="690.1"
            y2="308"
          />
          <circle
            id="arrow-pivot_00000027569680680974241500000014256160763569315245_"
            className="blackStroke"
            cx="690.1"
            cy="308"
            r="0.5"
          />
        </g>
      </g>
      <g id="wires-static">
        <path
          className="thickBlueStroke"
          d="M1217.8,425.6c-39.8,13.4-95.8,85.5-161.7,98.1"
        />
        <path
          className="thickPinkStroke"
          d="M1245.1,439.6c-69.6,0.5-113,159.7-283.5,207.4c-141,39.4-265.5-63.1-368-57"
        />
        <path
          className="thickBlueStroke"
          d="M970.6,544.3C887.7,568.7,725,523.9,681,530.2"
        />
      </g>
      <path
        id="bluewire"
        fill="none"
        stroke="#0094EF"
        strokeWidth="4"
        d={`M798.9,361.2C963.7,509.5,1390.6,148,${interpolate(
          1349,
          323,
          1475,
          290,
          magnetPosition
        )}`}
      />
      <path
        id="redwire"
        fill="none"
        stroke="#ED0082"
        strokeWidth="4"
        d={`M754.6,400.2C963.7,550,1390.6,170,${interpolate(
          1372,
          330,
          1498,
          297,
          magnetPosition
        )}`}
      />
    </g>
  </svg>
);

const InductionExperiment = styled(InductionExperimentGeometry)`
  margin-left: calc(
    0px - ${(props) => props.theme.spacing} -
      ${(props) => props.theme.spacingQuarter}
  );
  margin-right: calc(0px - ${(props) => props.theme.spacingHalf});

  .blackStroke {
    fill: none;
    stroke: ${(props) => props.theme.foregroundColor};
    stroke-width: 1.5;
  }
  .thickBlackStroke {
    fill: none;
    stroke: ${(props) => props.theme.foregroundColor};
    stroke-width: 2;
  }
  .whiteFillBlackStroke {
    fill: ${(props) => props.theme.backgroundColor};
    stroke: ${(props) => props.theme.foregroundColor};
    stroke-width: 1.5;
  }
  .whiteFillGreyStroke {
    fill: ${(props) => props.theme.backgroundColor};
    stroke: #878787;
    stroke-width: 1.5;
  }
  .greyStroke {
    fill: none;
    stroke: #878787;
    stroke-width: 1.5;
  }
  .tealStroke {
    fill: none;
    stroke: #2ec6b7;
    stroke-width: 1.5;
  }
  .whiteFillBlueStroke {
    fill: ${(props) => props.theme.backgroundColor};
    stroke: #0094ef;
    stroke-width: 1.5;
  }
  .blueStroke {
    fill: none;
    stroke: #0094ef;
    stroke-width: 1.5;
  }
  .thickBlueStroke {
    fill: none;
    stroke: #0094ef;
    stroke-width: 4;
  }
  .whiteFillPinkStroke {
    fill: ${(props) => props.theme.backgroundColor};
    stroke: #ed0082;
    stroke-width: 1.5;
  }
  .whiteFill {
    fill: ${(props) => props.theme.backgroundColor};
  }
  .pinkStroke {
    fill: none;
    stroke: #ed0082;
    stroke-width: 1.5;
  }
  .thickPinkStroke {
    fill: none;
    stroke: #ed0082;
    stroke-width: 4;
  }
  .pinkFill {
    fill: #ed0082;
  }
  .blackFill {
    fill: ${(props) => props.theme.foregroundColor};
  }
`;

const Example = styled.section`
  position: relative;
  margin-top: ${(props) => props.theme.spacingHalf};
  margin-left: ${(props) => props.theme.spacingHalf};
`;

const Reaction = styled.aside`
  position: absolute;
  right: 0;
  top: calc(0px - ${(props) => props.theme.spacingHalf});
`;

const ExperimentExample: FC = () => {
  const {
    toggle,
    setToggle,
    magnetPosition,
    magnetDelta,
    magnetNormalizedDelta,
    moveMagnet,
    hysteresis,
  } = useInduction();

  return (
    <Example>
      <Controls>
        <Control>
          switch
          <input
            type="range"
            min="0"
            max="1"
            step="1"
            value={toggle}
            onChange={(e) => setToggle(e.target.valueAsNumber)}
          />
          {toggle > 0 ? 'on' : 'off'}
        </Control>
        <Control>
          magnet
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.01"
            value={magnetPosition}
            onChange={moveMagnet}
          />
          {magnetPosition}
        </Control>
        <Control>
          current {magnetDelta < 0 ? '-5' : magnetDelta > 0 ? '+5' : '0'} uA
        </Control>
        <Control>hysteresis {hysteresis}</Control>
      </Controls>
      <InductionExperiment
        magnetPosition={magnetPosition}
        magnetDelta={magnetNormalizedDelta}
        toggle={Boolean(toggle)}
      />
      <Reaction>
        <BeavisAndButthead chortle={hysteresis > 4} />
      </Reaction>
    </Example>
  );
};

export default ExperimentExample;
