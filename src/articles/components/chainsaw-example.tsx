import React, { FC } from 'react';
import styled from 'styled-components';

const ChainsawIllustration: FC<{ className?: string }> = ({ className }) => (
  <svg width="300" viewBox="0 0 400.9 308.3" className={className}>
    <g strokeWidth="1.5">
      <path
        id="cloud"
        className="fill-border"
        style={{ opacity: 0.2 }}
        d="M352.7,108.1h-59.3h-79.2h-24.4c-8.7,0-15.8-7.1-15.8-15.8s7.1-15.8,15.8-15.8h24.4h2.1
		c8.7,0,15.8-7.1,15.8-15.8s-7.1-15.8-15.8-15.8H114.1c-8.7,0-15.8,7.1-15.8,15.8s7.1,15.8,15.8,15.8h12.3c8.7,0,15.8,7.1,15.8,15.8
		s-7.1,15.8-15.8,15.8h-15.8H92.9c-8.7,0-15.8,7.1-15.8,15.8s7.1,15.8,15.8,15.8h13.1h52.3c8.7,0,15.8,7.1,15.8,15.8
		s-7.1,15.8-15.8,15.8h-47.5c-8.7,0-15.8,7.1-15.8,15.8s7.1,15.8,15.8,15.8h47.5c8.7,0,15.8,7.1,15.8,15.8s-7.1,15.8-15.8,15.8h-11
		c-8.7,0-15.8,7.1-15.8,15.8s7.1,15.8,15.8,15.8h85.9c8.7,0,15.8-7.1,15.8-15.8s-7.1-15.8-15.8-15.8h-11.6
		c-8.7,0-15.8-7.1-15.8-15.8s7.1-15.8,15.8-15.8H263h45.5c8.7,0,15.8-7.1,15.8-15.8s-7.1-15.8-15.8-15.8H263h-41.5
		c-8.7,0-15.8-7.1-15.8-15.8s7.1-15.8,15.8-15.8H263h62.2h27.6c8.7,0,15.8-7.1,15.8-15.8S361.5,108.1,352.7,108.1z"
      />
      <g id="blade">
        <polygon
          id="blade-fill"
          className="fill-opaque"
          points="212,136 92.6,202.4 114.5,211.4 154.2,193.4 210.9,162.9 	"
        />
        <path
          className="fill-opaque stroke-foreground"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M206.4,139.4
      l-7.2-3.5c0,0-55.1,24-55.1,24l-97.3,53.4c-3.2,1.6-7,5.3-9.2,9c-3.6,6.1-3.7,13.6,0.2,15l7.2,3.5"
        />

        <ellipse
          transform="matrix(0.5539 -0.8326 0.8326 0.5539 -167.8129 145.4218)"
          className="fill-none stroke-border"
          strokeLinecap="round"
          strokeLinejoin="round"
          cx="51.8"
          cy="229.3"
          rx="7"
          ry="4"
        />
        <path
          className="fill-none stroke-border"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M206.4,139.4
      c0,0-55.1,24-55.1,24l-97.3,53.4c-3.2,1.6-7,5.3-9.2,9c-3.6,6.1-3.7,13.6,0.2,15c1.8,0.7,4,0.2,6.6-0.9l102.6-46.6l52.2-28V139.4z"
        />

        <path
          id="chain"
          className="fill-none stroke-foreground"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10,8"
          d="
      M206.7,135.5c0,0-57.2,25-57.2,25L48.3,216c-3.3,1.7-10.3,6.4-11,18c-0.6,9,8.5,11,14.4,8.2l100.7-45.2l54.3-29.1V135.5z"
        />
      </g>
      <g id="body">
        <polygon
          id="body-fill"
          className="fill-opaque"
          points="303.1,144 269.5,178.7 229.3,185 222.8,174.4 215.7,169.8 209.6,167 205,166.3 
      205,137.9 195.5,133.3 191.8,111 192.7,106.6 239.2,76.9 353,104.7 309.5,136 305.3,136.7 	"
        />
        <path
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M295.9,135.5
      c0,0-10.4-14.5-11.3-14.1c-0.9,0.5-68.9,30.5-68.9,30.5l-10.9-4.9"
        />
        <polyline
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="
      223.1,158.7 215.7,151.9 215.7,170.1 	"
        />
        <polyline
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="
      269.6,178.6 269.6,150.6 223.1,158.7 223.1,174.7 	"
        />
        <polyline
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="
      220.1,124.2 208,113.3 192.4,107.2 	"
        />

        <line
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          x1="254"
          y1="60.1"
          x2="266.5"
          y2="66.3"
        />

        <line
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          x1="239.2"
          y1="76.9"
          x2="252.2"
          y2="83.6"
        />
        <polyline
          className="fill-opaque"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="
      306.1,136.7 306.1,128.1 284.9,141.8 295.9,150.4 295.9,135.5 269.6,150.6 	"
        />
        <path
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M208,113.3
      c0,0,42.7-28.4,44.2-29.7s13.6-16.6,14.3-17.3c1.3-1.5,35.2-15.4,35.2-15.4s5.7,26.8,5.6,28.4c-0.1,1.6-8.9,24.8-8.9,24.8
      l-18.8,15.7l-63,27.9l-11.8-5.8"
        />

        <line
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          x1="349.8"
          y1="97.1"
          x2="332.3"
          y2="89"
        />

        <line
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          x1="353.8"
          y1="89"
          x2="340.1"
          y2="82.7"
        />
        <path
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M204.9,137.8
      c0.1-0.3-9.4-4-9.5-4.7s-2.4-12.5-3.3-18.8c-0.3-2-0.7-7,1.2-8.4c3-2.1,41.4-26,45.8-29.1c1.9-1.3,12.1-13.4,14.2-16.3
      c1.5-2.1,28.8-13.6,32.9-14.9c2.3-0.7,14.1,3.8,15.4,5.1c2.4,2.4,4.7,5.5,6.8,7.3c2.1,1.9,21.3,7,29.4,9.2
      c8.1,2.3,12.8,4.9,16.4,6.4c3.6,1.5,5.6,4.1,5.6,6.2c0,2.1-0.8,11.9-1.5,16.4c-0.8,4.5-4.5,7.7-4.5,7.7s-43.8,30.7-45.2,31.8
      c-0.9,0.8-2.6,0.8-2.6,0.8c-1.7,5.1-1.7,6-3,7.3c-1,1.1-7.2,6.4-7.2,6.4l-0.6,2.8c0,0-23.5,22.4-25.8,25.4
      c-1.7,2.3-37.8,6.4-40.4,6.4c-1.3,0-5.3-9-6.1-10.4c-0.8-1.3-8.8-5.5-11.5-6.6c-2.6-1.1-1.4-0.6-6.6-1.7
      C205,166.4,204.8,138.1,204.9,137.8z"
        />
        <path
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M309.5,90.6
      c1.4-3.8,41.1-10.6,42.9-8.3c2.1,2.6,1.6,9.9,0.4,12.3c-1.1,2.4-46,31.5-49.8,31.5C299.2,126.1,308,94.4,309.5,90.6z"
        />
        <path
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M307.3,97.7
      c0,0,1.3,0.8,4.1,0c2.8-0.8,19.3-8.2,21-9.3c1.3-0.8,5.6-3.3,5.6-5.4"
        />
        <polyline
          fill="none"
          stroke="#0094EF"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="
      307.3,79.2 279.7,102.8 220.1,124.2 215.7,151.9 	"
        />
        <path
          fill="none"
          stroke="#0094EF"
          d="M233,165.5c-1.1,0-2.2-0.9-2.3-2.1c-0.2-1.4,0.7-2.6,2-2.8l29.6-4.6
      c1.3-0.2,2.5,0.7,2.7,2.1c0.2,1.4-0.7,2.6-2,2.8l-29.6,4.6C233.2,165.5,233.1,165.5,233,165.5z"
        />
        <path
          fill="none"
          stroke="#0094EF"
          d="M233.1,173.7c-1.1,0-2.2-0.9-2.3-2.1c-0.2-1.4,0.7-2.6,2-2.8
      l29.6-4.6c1.3-0.2,2.5,0.7,2.7,2.1c0.2,1.4-0.7,2.6-2,2.8l-29.6,4.6C233.3,173.7,233.2,173.7,233.1,173.7z"
        />
        <path
          fill="none"
          stroke="#0094EF"
          d="M233.1,181.9c-1.1,0-2.2-0.9-2.3-2.1c-0.2-1.4,0.7-2.6,2-2.8
      l29.6-4.6c1.3-0.2,2.5,0.7,2.7,2.1c0.2,1.4-0.7,2.6-2,2.8l-29.6,4.6C233.4,181.9,233.2,181.9,233.1,181.9z"
        />
      </g>
      <g id="caps">
        <g>
          <ellipse
            transform="matrix(0.3311 -0.9436 0.9436 0.3311 86.2006 368.2455)"
            className="fill-opaque"
            stroke="#ED0082"
            strokeLinecap="round"
            strokeLinejoin="round"
            cx="302.8"
            cy="123.3"
            rx="10.1"
            ry="9.2"
          />
          <path
            fill="none"
            stroke="#ED0082"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M300.4,133.2
        c-4-1.4-5.7-6.8-3.8-12.1c1.8-5.3,6.6-8.4,10.5-7"
          />
          <line
            fill="none"
            stroke="#ED0082"
            strokeLinecap="round"
            strokeLinejoin="round"
            x1="305.1"
            y1="115.9"
            x2="307.9"
            y2="115.6"
          />
          <polyline
            className="fill-opaque"
            stroke="#ED0082"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="
        300.4,133.4 305.1,134.8 308,134.2 312.5,117.1 307.9,115.6 305.1,115.9 300.8,133.5 		"
          />
          <polyline
            fill="none"
            stroke="#ED0082"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="
        305.1,134.8 309.5,117.3 305.1,115.9 		"
          />
        </g>

        <line
          stroke="#ED0082"
          strokeLinecap="round"
          strokeLinejoin="round"
          x1="308.2"
          y1="94.5"
          x2="311.2"
          y2="94.3"
        />
        <g>
          <ellipse
            transform="matrix(0.3311 -0.9436 0.9436 0.3311 106.8738 351.8559)"
            className="fill-opaque"
            stroke="#ED0082"
            strokeLinecap="round"
            strokeLinejoin="round"
            cx="301.6"
            cy="100.5"
            rx="10.1"
            ry="9.2"
          />
          <path
            fill="none"
            stroke="#ED0082"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M299.2,110.4
        c-4-1.4-5.7-6.8-3.8-12.1c1.8-5.3,6.6-8.4,10.5-7"
          />
          <line
            fill="none"
            stroke="#ED0082"
            strokeLinecap="round"
            strokeLinejoin="round"
            x1="303.8"
            y1="93.1"
            x2="306.7"
            y2="92.8"
          />
          <polyline
            className="fill-opaque"
            stroke="#ED0082"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="
        299.2,110.6 303.8,112 306.7,111.4 311.2,94.3 306.7,92.8 303.8,93.1 299.6,110.7 		"
          />
          <polyline
            fill="none"
            stroke="#ED0082"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="
        303.8,112 308.2,94.5 303.8,93.1 		"
          />
        </g>
      </g>
      <g id="handle">
        <path
          className="fill-opaque"
          stroke="#7A7A7A"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M286.7,161.5
      c0,0-6.9,2.1-2.3-9.1c-0.5,1.3,0.9-1.4,1-3c0.2-4.3-3.6-39.6-6.4-49.3c-0.7-2.3-8.5-11.2-24-21.8c-14.4-9.9-28.2-16.2-36.1-16.7
      c-3.7,0-5.9,0.4-7,0.8l8.1,28.7c0.9,3.2-1,6.5-4.1,7.4c-3.2,0.9-6.5-1-7.4-4.1l-8.8-31.2c0-0.1,0-0.2-0.1-0.2
      c-0.5-1.9-0.2-5,1.9-7.6c3-3.8,8.8-5.7,17.6-5.7c0.1,0,0.2,0,0.3,0C234,50.3,254,63,261.9,68.5c4.3,2.9,25.7,18.1,28.6,28.3
      c3.2,11.3,7,47.8,6.8,53.1C297.1,157,287.5,160.8,286.7,161.5z"
        />
      </g>
    </g>
  </svg>
);

const Chainsaw = styled(ChainsawIllustration)`
  #chain {
    animation: saw 0.1s linear infinite;
  }

  @keyframes saw {
    0% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -18;
    }
  }
`;

const Example = styled.section`
  margin-top: ${(props) => props.theme.spacingHalf};
`;

const ChainsawExample: FC = () => (
  <Example>
    <Chainsaw />
  </Example>
);

export default ChainsawExample;
