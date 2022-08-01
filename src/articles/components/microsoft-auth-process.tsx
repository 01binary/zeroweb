import React, { FC } from 'react';
import styled from 'styled-components';
import { StaticImage } from 'gatsby-plugin-image';

const Wrapper = styled.section`
  position: relative;
`;

const ImageWrapper = styled.section`
  z-index: -1;
  position: absolute;
  right: 12%;
  width: 84%;
`;

const Process: FC = () => (
  <Wrapper>
    <ImageWrapper>
      <StaticImage
        src="../images/microsoft-authentication-process.png"
        alt="test"
      />
    </ImageWrapper>
    <svg viewBox="0 0 2008 1405">
      <g id="bars">
        <g>
          <line
            className="stroke-border"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"

            x1="612.8"
            y1="1150.3"
            x2="569.2"
            y2="1100.9"
          />

          <polyline
            className="fill-none stroke-border"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"

            points="
			551.4,1127.4 569.2,1100.9 618.3,1110.4 		"
          />
        </g>
        <g>
          <line
            className="stroke-border"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"

            x1="710.6"
            y1="977.2"
            x2="679.5"
            y2="942.1"
          />

          <polyline
            className="fill-none stroke-border"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"

            points="
			661.7,968.6 679.5,942.1 728.6,951.6 		"
          />
        </g>
        <g>
          <line
            className="stroke-border"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"

            x1="1332.6"
            y1="821.9"
            x2="1302.3"
            y2="786"
          />

          <polyline
            className="fill-none stroke-border"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"

            points="
			1283.9,812 1302.3,786 1351.2,796.7 		"
          />
        </g>
        <g>
          <line
            className="stroke-border"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"

            x1="863.7"
            y1="896"
            x2="894.8"
            y2="931.1"
          />

          <polyline
            className="fill-none stroke-border"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"

            points="
			912.6,904.7 894.8,931.1 845.7,921.6 		"
          />
        </g>
        <g>
          <line
            className="stroke-border"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"

            x1="1420.5"
            y1="763.5"
            x2="1555.5"
            y2="916"
          />

          <polyline
            className="fill-none stroke-border"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"

            points="
			1573.3,889.6 1555.5,916 1506.4,906.5 		"
          />
        </g>
        <path
          fill="#2E6AFF"
          d="M1456.3,703.2c-16.1-17.9-64.8-23.5-108.8-12.5L624,872.6c-44,11.1-66.5,34.6-50.4,52.5
		c16.1,17.9,64.8,23.5,108.8,12.5l723.5-181.9C1449.9,744.6,1472.4,721.1,1456.3,703.2z M661.5,922.5c-21.8,5.5-45.9,2.7-53.9-6.2
		c-8-8.9,3.2-20.5,25-26s45.9-2.7,53.9,6.2C694.5,905.3,683.3,917,661.5,922.5z M846,876.4c-21.8,5.5-45.9,2.7-53.9-6.2
		c-8-8.9,3.2-20.5,25-26s45.9-2.7,53.9,6.2C878.9,859.3,867.8,870.9,846,876.4z M1283.8,766.3c-21.8,5.5-45.9,2.7-53.9-6.2
		s3.2-20.5,25-26s45.9-2.7,53.9,6.2C1316.8,749.2,1305.6,760.8,1283.8,766.3z M1395.6,736.2c-19.6,4.9-41.3,2.4-48.5-5.6
		c-7.2-8,2.9-18.5,22.5-23.4s41.3-2.4,48.5,5.6C1425.3,720.8,1415.2,731.3,1395.6,736.2z"
        />
        <path
          fill="#2E6AFF"
          d="M1660.4,936.1c-16.1-17.9-64.8-23.5-108.8-12.5L333.4,1228.9c-44,11.1-66.5,34.6-50.4,52.5
		s64.8,23.5,108.8,12.5L1610,988.6C1654,977.5,1676.5,954,1660.4,936.1z M368.5,1277.6c-21.8,5.5-45.9,2.7-53.9-6.2
		c-8-8.9,3.2-20.5,25-26c21.8-5.5,45.9-2.7,53.9,6.2C401.4,1260.5,390.2,1272.1,368.5,1277.6z M662.1,1204.6
		c-21.8,5.5-45.9,2.7-53.9-6.2c-8-8.9,3.2-20.5,25-26c21.8-5.5,45.9-2.7,53.9,6.2C695,1187.5,683.8,1199.1,662.1,1204.6z
		 M1604.8,968.8c-19.6,4.9-41.3,2.4-48.5-5.6c-7.2-8,2.9-18.5,22.5-23.4s41.3-2.4,48.5,5.6C1634.5,953.4,1624.4,963.9,1604.8,968.8z
		"
        />
        <path
          fill="#2E6AFF"
          d="M1435.2,840.4c-16.1-17.9-64.8-23.5-108.8-12.5L514,1030c-44,11.1-66.5,34.6-50.4,52.5
		c16.1,17.9,64.8,23.5,108.8,12.5l812.4-202.1C1428.8,881.8,1451.4,858.3,1435.2,840.4z M549.7,1079.5c-21.8,5.5-45.9,2.7-53.9-6.2
		c-8-8.9,3.2-20.5,25-26c21.8-5.5,45.9-2.7,53.9,6.2C582.7,1062.3,571.5,1074,549.7,1079.5z M756.8,1028.4
		c-21.8,5.5-45.9,2.7-53.9-6.2c-8-8.9,3.2-20.5,25-26c21.8-5.5,45.9-2.7,53.9,6.2C789.8,1011.3,778.6,1022.9,756.8,1028.4z
		 M941.7,982.8c-21.8,5.5-45.9,2.7-53.9-6.2c-8-8.9,3.2-20.5,25-26c21.8-5.5,45.9-2.7,53.9,6.2C974.6,965.7,963.5,977.3,941.7,982.8
		z M1379.7,872.8c-19.6,4.9-41.3,2.4-48.5-5.6c-7.2-8,2.9-18.5,22.5-23.4s41.3-2.4,48.5,5.6C1409.3,857.4,1399.3,867.9,1379.7,872.8
		z"
        />
      </g>
      <g id="connectors" className="fill-none stroke-border">
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="354"
              y1="1140.7"
              x2="354"
              y2="1143.7"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="6.0433,6.0433"
              x1="354"
              y1="1149.7"
              x2="354"
              y2="1255.5"
            />
            <line
              strokeWidth="4"
  
              x1="354"
              y1="1258.5"
              x2="354"
              y2="1261.5"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="354"
              y1="1013.6"
              x2="354"
              y2="1016.6"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="6.4033,6.4033"
              x1="354"
              y1="1023"
              x2="354"
              y2="1058.3"
            />
            <line
              strokeWidth="4"
  
              x1="354"
              y1="1061.5"
              x2="354"
              y2="1064.5"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="928.3"
              y1="718.7"
              x2="928.3"
              y2="721.7"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="5.9319,5.9319"
              x1="928.3"
              y1="727.6"
              x2="928.3"
              y2="961.9"
            />
            <line
              strokeWidth="4"
  
              x1="928.3"
              y1="964.9"
              x2="928.3"
              y2="967.9"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="928.3"
              y1="594.1"
              x2="928.3"
              y2="597.1"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="6.4212,6.4212"
              x1="928.3"
              y1="603.5"
              x2="928.3"
              y2="664.5"
            />
            <line
              strokeWidth="4"
  
              x1="928.3"
              y1="667.7"
              x2="928.3"
              y2="670.7"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="928.3"
              y1="427.5"
              x2="928.3"
              y2="430.5"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="5.9645,5.9645"
              x1="928.3"
              y1="436.4"
              x2="928.3"
              y2="493.1"
            />
            <line
              strokeWidth="4"
  
              x1="928.3"
              y1="496.1"
              x2="928.3"
              y2="499.1"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="1269.4"
              y1="620.7"
              x2="1269.4"
              y2="623.7"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="5.8814,5.8814"
              x1="1269.4"
              y1="629.6"
              x2="1269.4"
              y2="744.3"
            />
            <line
              strokeWidth="4"
  
              x1="1269.4"
              y1="747.2"
              x2="1269.4"
              y2="750.2"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="1269.4"
              y1="471.8"
              x2="1269.4"
              y2="474.8"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="5.9196,5.9196"
              x1="1269.4"
              y1="480.7"
              x2="1269.4"
              y2="572.5"
            />
            <line
              strokeWidth="4"
  
              x1="1269.4"
              y1="575.5"
              x2="1269.4"
              y2="578.5"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="1587.9"
              y1="440.4"
              x2="1587.9"
              y2="443.4"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="6.795,6.795"
              x1="1587.9"
              y1="450.2"
              x2="1587.9"
              y2="487.6"
            />
            <line
              strokeWidth="4"
  
              x1="1587.9"
              y1="491"
              x2="1587.9"
              y2="494"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="1587.9"
              y1="219.1"
              x2="1587.9"
              y2="222.1"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="6.1452,6.1452"
              x1="1587.9"
              y1="228.3"
              x2="1587.9"
              y2="311.2"
            />
            <line
              strokeWidth="4"
  
              x1="1587.9"
              y1="314.3"
              x2="1587.9"
              y2="317.3"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="1587.9"
              y1="546.4"
              x2="1587.9"
              y2="549.4"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="5.9236,5.9236"
              x1="1587.9"
              y1="555.3"
              x2="1587.9"
              y2="955.2"
            />
            <line
              strokeWidth="4"
  
              x1="1587.9"
              y1="958.1"
              x2="1587.9"
              y2="961.1"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="354"
              y1="891.1"
              x2="354"
              y2="894.1"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="5.3994,5.3994"
              x1="354"
              y1="899.5"
              x2="354"
              y2="940"
            />
            <line
              strokeWidth="4"
  
              x1="354"
              y1="942.7"
              x2="354"
              y2="945.7"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="354"
              y1="793.9"
              x2="354"
              y2="796.9"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="6.4206,6.4206"
              x1="354"
              y1="803.4"
              x2="354"
              y2="838.7"
            />
            <line
              strokeWidth="4"
  
              x1="354"
              y1="841.9"
              x2="354"
              y2="844.9"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="354"
              y1="661.3"
              x2="354"
              y2="664.3"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="6.647,6.647"
              x1="354"
              y1="670.9"
              x2="354"
              y2="680.9"
            />
            <line
              strokeWidth="4"
  
              x1="354"
              y1="684.2"
              x2="354"
              y2="687.2"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="535.2"
              y1="647"
              x2="535.2"
              y2="650"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="6.148,6.148"
              x1="535.2"
              y1="656.2"
              x2="535.2"
              y2="677.7"
            />
            <line
              strokeWidth="4"
  
              x1="535.2"
              y1="680.8"
              x2="535.2"
              y2="683.8"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="647.1"
              y1="799"
              x2="647.1"
              y2="802"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="5.9632,5.9632"
              x1="647.1"
              y1="807.9"
              x2="647.1"
              y2="900.4"
            />
            <line
              strokeWidth="4"
  
              x1="647.1"
              y1="903.4"
              x2="647.1"
              y2="906.4"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="647.1"
              y1="556.3"
              x2="647.1"
              y2="559.3"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="5.8606,5.8606"
              x1="647.1"
              y1="565.2"
              x2="647.1"
              y2="749.8"
            />
            <line
              strokeWidth="4"
  
              x1="647.1"
              y1="752.7"
              x2="647.1"
              y2="755.7"
            />
          </g>
        </g>
        <g>
          <g>
            <line
              strokeWidth="4"
  
              x1="535.2"
              y1="731.7"
              x2="535.2"
              y2="734.7"
            />

            <line
              strokeWidth="4"
  
              strokeDasharray="5.9208,5.9208"
              x1="535.2"
              y1="740.6"
              x2="535.2"
              y2="1057.4"
            />
            <line
              strokeWidth="4"
  
              x1="535.2"
              y1="1060.4"
              x2="535.2"
              y2="1063.4"
            />
          </g>
        </g>
      </g>

      <g id="labels">
        <text
          transform="matrix(1 0 0 1 234.2562 444.8546)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          B
        </text>
        <text
          transform="matrix(1 0 0 1 262.2713 444.8546)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          r
        </text>
        <text
          transform="matrix(1 0 0 1 277.0589 444.8546)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          o
        </text>
        <text
          transform="matrix(1 0 0 1 302.723 444.8546)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          w
        </text>
        <text
          transform="matrix(1 0 0 1 336.5389 444.8546)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          s
        </text>
        <text
          transform="matrix(1 0 0 1 359.742 444.8546)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          e
        </text>
        <text
          transform="matrix(1 0 0 1 383.5824 444.8546)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          r
        </text>
        <polygon
          fill="none"
          points="562.3,948.2 269.9,1019.7 245.5,987.6 538,916 	"
        />

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 261.0003 1007.984)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          .
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 277.527 1003.9393)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          N
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 322.2931 992.9832)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          E
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 358.5965 984.0982)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          T
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 394.8386 975.2283)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          {' '}
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 410.3841 971.4237)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          A
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 451.3481 961.3981)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          p
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 486.5784 952.7758)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          p
        </text>
        <polygon
          fill="none"
          points="473.2,1100.7 180.8,1172.2 156.4,1140.1 448.8,1068.5 	"
        />

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 171.8558 1160.468)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          A
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 213.1878 1150.3523)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          z
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 244.3094 1142.7356)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          u
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 278.9264 1134.2634)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          r
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 299.5924 1129.2056)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          e
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 332.8604 1121.0636)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          {' '}
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 348.4059 1117.2589)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          A
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 389.3699 1107.2334)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          D
        </text>
        <polygon
          fill="none"
          points="325.4,1293 33,1364.6 8.6,1332.4 301,1260.9 	"
        />

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 24.0637 1352.8324)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          B
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 63.1573 1343.2645)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          r
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 83.7926 1338.2142)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          o
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 119.6055 1329.4493)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          w
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 166.7938 1317.9005)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          s
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 199.1726 1309.9761)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          e
        </text>

        <text
          transform="matrix(1.84 -0.4503 0.6038 0.7972 232.4405 1301.834)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="34.1272px"
        >
          r
        </text>
        <rect x="1679.9" y="38.5" fill="none" width="180.7" height="54.2" />
        <text
          transform="matrix(1 0 0 1 1679.9481 72.2929)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          B
        </text>
        <text
          transform="matrix(1 0 0 1 1707.9633 72.2929)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          r
        </text>
        <text
          transform="matrix(1 0 0 1 1722.7509 72.2929)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          o
        </text>
        <text
          transform="matrix(1 0 0 1 1748.4149 72.2929)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          w
        </text>
        <text
          transform="matrix(1 0 0 1 1782.2308 72.2929)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          s
        </text>
        <text
          transform="matrix(1 0 0 1 1805.434 72.2929)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          e
        </text>
        <text
          transform="matrix(1 0 0 1 1829.2743 72.2929)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          r
        </text>
        <rect x="981.9" y="250.7" fill="none" width="210.1" height="47.4" />
        <text
          transform="matrix(1 0 0 1 981.9248 284.4789)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          A
        </text>
        <text
          transform="matrix(1 0 0 1 1011.5439 284.4789)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          z
        </text>
        <text
          transform="matrix(1 0 0 1 1033.8462 284.4789)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          u
        </text>
        <text
          transform="matrix(1 0 0 1 1058.6533 284.4789)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          r
        </text>
        <text
          transform="matrix(1 0 0 1 1073.4629 284.4789)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          e
        </text>
        <text
          transform="matrix(1 0 0 1 1097.3032 284.4789)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          {' '}
        </text>
        <text
          transform="matrix(1 0 0 1 1108.4434 284.4789)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          A
        </text>
        <text
          transform="matrix(1 0 0 1 1137.7988 284.4789)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          D
        </text>
        <rect x="673.6" y="432.1" fill="none" width="210.1" height="47.4" />
        <text
          transform="matrix(1 0 0 1 673.596 465.8903)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          A
        </text>
        <text
          transform="matrix(1 0 0 1 703.2151 465.8903)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          z
        </text>
        <text
          transform="matrix(1 0 0 1 725.5174 465.8903)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          u
        </text>
        <text
          transform="matrix(1 0 0 1 750.3245 465.8903)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          r
        </text>
        <text
          transform="matrix(1 0 0 1 765.1341 465.8903)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          e
        </text>
        <text
          transform="matrix(1 0 0 1 788.9744 465.8903)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          {' '}
        </text>
        <text
          transform="matrix(1 0 0 1 800.1146 465.8903)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          A
        </text>
        <text
          transform="matrix(1 0 0 1 829.47 465.8903)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          D
        </text>
        <rect x="559.5" y="128.8" fill="none" width="219.1" height="52" />
        <text
          transform="matrix(1 0 0 1 559.5256 162.5027)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          .
        </text>
        <text
          transform="matrix(1 0 0 1 571.3689 162.5027)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          N
        </text>
        <text
          transform="matrix(1 0 0 1 603.449 162.5027)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          E
        </text>
        <text
          transform="matrix(1 0 0 1 629.4646 162.5027)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          T
        </text>
        <text
          transform="matrix(1 0 0 1 655.4363 162.5027)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          {' '}
        </text>
        <text
          transform="matrix(1 0 0 1 666.5764 162.5027)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          A
        </text>
        <text
          transform="matrix(1 0 0 1 695.9319 162.5027)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          p
        </text>
        <text
          transform="matrix(1 0 0 1 721.1785 162.5027)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          p
        </text>
        <rect x="1047.4" y="58.7" fill="none" width="219.1" height="52" />
        <text
          transform="matrix(1 0 0 1 1047.4305 92.4793)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          .
        </text>
        <text
          transform="matrix(1 0 0 1 1059.2738 92.4793)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          N
        </text>
        <text
          transform="matrix(1 0 0 1 1091.3539 92.4793)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          E
        </text>
        <text
          transform="matrix(1 0 0 1 1117.3695 92.4793)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          T
        </text>
        <text
          transform="matrix(1 0 0 1 1143.3412 92.4793)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          {' '}
        </text>
        <text
          transform="matrix(1 0 0 1 1154.4813 92.4793)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          A
        </text>
        <text
          transform="matrix(1 0 0 1 1183.8368 92.4793)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          p
        </text>
        <text
          transform="matrix(1 0 0 1 1209.0834 92.4793)"
          className="fill-background"
          fontFamily="'Roboto-Regular'"
          fontSize="45px"
        >
          p
        </text>
      </g>
      <g id="indicators">
        <g id="access">
          <circle
            fill="none"
            stroke="#975BA3"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            cx="354"
            cy="740.6"
            r="53.4"
          />
          <path
            fill="none"
            stroke="#975BA3"
            strokeWidth="4"
            strokeLinecap="square"
            strokeLinejoin="round"
            d="
			M352.7,736.3c-1.9-7.5-8.7-13.1-16.8-13.1c-9.6,0-17.3,7.8-17.3,17.3s7.8,17.3,17.3,17.3c8.1,0,14.9-5.6,16.8-13.1h19.2v8h4.1
			l2.8-2.8l2.8,2.8h4.1v-8h3.8v-8.5H352.7z M335.9,747.9c-4,0-7.3-3.3-7.3-7.3s3.3-7.3,7.3-7.3c4,0,7.3,3.3,7.3,7.3
			S339.9,747.9,335.9,747.9z"
          />
        </g>
        <g>
          <circle
            fill="none"
            stroke="#1C9694"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"

            cx="1587.3"
            cy="378.8"
            r="53.4"
          />

          <polyline
            fill="none"
            stroke="#1C9694"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"

            points="
			1570.4,377.9 1581.6,389.1 1605.9,364.8 		"
          />
        </g>
        <g>
          <path
            fill="none"
            stroke="#456ABA"
            strokeWidth="6"

            d="M956.1,509.1c-4.3-3.3-6.8-9.9-11.7-11.6
			c-5.1-1.8-11.2,1.7-16.4,1.5c-5.3-0.2-11.2-4-16.3-2.5c-5,1.5-7.9,7.8-12.4,10.9c-4.3,2.9-11.3,3.2-14.6,7.5
			c-3.3,4.3-1.9,11.2-3.6,16.1c-1.8,5.1-7.3,9.5-7.4,14.7c-0.2,5.3,5,10,6.5,15.1c1.5,5-0.4,11.8,2.6,16.3c2.9,4.3,9.9,5.1,14.2,8.4
			c4.3,3.3,6.8,9.9,11.7,11.6c5.1,1.8,11.2-1.7,16.4-1.5c5.3,0.2,11.2,4,16.3,2.5c5-1.5,7.9-7.8,12.4-10.9
			c4.3-2.9,11.3-3.2,14.6-7.5c3.3-4.3,1.9-11.2,3.6-16.1c1.8-5.1,7.3-9.5,7.4-14.7c0.2-5.3-5-10-6.5-15.1c-1.5-5,0.4-11.8-2.6-16.3
			C967.3,513.2,960.4,512.5,956.1,509.1z"
          />

          <polyline
            fill="none"
            stroke="#456ABA"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"

            points="
			910.2,546.7 921.4,557.9 945.7,533.6 		"
          />
        </g>
      </g>
      <g id="numbers">
        <polyline
          fill="none"
          stroke="#EE568E"
          strokeWidth="3"
          stroke-miterlimit="10"
          points="353.1,844.9 323.4,844.9 292.9,867 
		323.4,889.1 384.5,889.1 415.1,867 384.5,844.9 353.1,844.9 	"
        />
        <text
          className="fill-foreground"
          transform="matrix(1 0 0 1 343.0235 879.6534)"
          fontFamily="'Roboto-Regular'"
          fontSize="39px"
        >
          1
        </text>
        <polygon
          fill="none"
          stroke="#EE568E"
          strokeWidth="3"
          points="565.8,685.4 504.7,685.4 474.1,707.5 
		504.7,729.7 565.8,729.7 596.4,707.5 	"
        />
        <text
          className="fill-foreground"
          transform="matrix(1 0 0 1 524.2938 720.1893)"
          fontFamily="'Roboto-Regular'"
          fontSize="39px"
        >
          2
        </text>
        <polygon
          fill="none"
          stroke="#EE568E"
          strokeWidth="3"
          points="677.6,755.6 616.5,755.6 585.9,777.7 
		616.5,799.8 677.6,799.8 708.2,777.7 	"
        />
        <text
          className="fill-foreground"
          transform="matrix(1 0 0 1 636.1053 790.3443)"
          fontFamily="'Roboto-Regular'"
          fontSize="39px"
        >
          3
        </text>
        <polygon
          fill="none"
          stroke="#EE568E"
          strokeWidth="3"
          points="1302.9,577.8 1241.8,577.8 1211.2,599.9 
		1241.8,622.1 1302.9,622.1 1333.4,599.9 	"
        />
        <text
          className="fill-foreground"
          transform="matrix(1 0 0 1 1261.3553 612.578)"
          fontFamily="'Roboto-Regular'"
          fontSize="39px"
        >
          5
        </text>
        <polygon
          fill="none"
          stroke="#EE568E"
          strokeWidth="3"
          points="1617.8,496.2 1556.7,496.2 1526.2,518.3 
		1556.7,540.4 1617.8,540.4 1648.4,518.3 	"
        />
        <text
          className="fill-foreground"
          transform="matrix(1 0 0 1 1576.3386 530.9437)"
          fontFamily="'Roboto-Regular'"
          fontSize="39px"
        >
          6
        </text>
        <polygon
          fill="none"
          stroke="#EE568E"
          strokeWidth="3"
          points="957.1,671 896,671 865.4,693.2 896,715.3 
		957.1,715.3 987.6,693.2 	"
        />
        <text
          className="fill-foreground"
          transform="matrix(1 0 0 1 915.5707 705.8026)"
          fontFamily="'Roboto-Regular'"
          fontSize="39px"
        >
          4
        </text>
      </g>
    </svg>
  </Wrapper>
);

export default Process;
