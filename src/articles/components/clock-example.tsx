import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Controls, Control } from './controls';

const ClockIllustration: FC<{
  className?: string;
  hours: number;
  minutes: number;
}> = ({ className, hours, minutes }) => (
  <svg width="300" viewBox="0 0 320 525" className={className}>
    <g id="body" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path
        id="tail"
        className="fill-none stroke-foreground"
        style={{
          transformOrigin: '169.5px 329px',
        }}
        d="
		M147.9,343.9c0,0-1.1,7.5-2.6,10.9c-1.5,3.4-9,34.3-10.9,49.7s-4.5,32.4-3.4,45.6c1.1,13.2,6.4,47.8,15.1,48.6
		c8.7,0.8,15.1-9.4,15.4-28.2c0.4-18.8-3-43.3,2.3-55c5.3-11.7,15.4-36.5,17.3-58.7c1.9-22.2,1.5-26,1.9-31.6
		c0.4-5.6-6.8-14.7-18.4-9.8S147.9,343.9,147.9,343.9z"
      />
      <path
        className="fill-opaque stroke-foreground"
        d="M213.3,155
		c4.6,3.5,10.2,8.2,13,11.3c3.1,3.5,10.1,9.2,12.8,18.3c1.7,5.8,0.4,9.8,1,12.2c0.6,2.4,2.1,5.9,0.4,9.3c-3.2,6.6-9.5,6.5-9.5,6.5
		l2.4,42c0,15.2,7.8,33.9,7.8,43.1c0,2.9,0.3,10.7-2.3,12.3c-2.9,1.9-4.4-0.6-6.5,0.4c-3.3,1.7-1.4,4.1-6.2,6.9
		c-5.7,3.4-6.3-0.7-9.8,0.8c-1.7,0.7-0.8,3-3.9,4.4c-3.1,1.3-5.5-1.6-9,0.1c0,0-29.9,9.3-33.6,10.4s-3.2,4.4-6.3,5.6
		c-3.1,1.1-4.2-0.8-5.8-0.2c-3.5,1.3-0.9,4.1-7.3,5.6c-5.4,1.3-5.8-1.3-9.3-0.3c-2.2,0.7-1.5,3.1-4.8,3.8c-3,0.6-11-3.8-19.2-8.5
		c-8.2-4.7-7-17.6-7-17.6V208.6c0-21.5,17.9-35,20.7-38c2.8-3,7.4-9,8.4-12.3"
      />
      <path
        className="fill-border"
        style={{ opacity: 0.33 }}
        d="M125.7,58.8c0,0,9.5,9.6,13,12.7c6.8,5.9,10.5,6.6-2,11"
      />
      <path
        className="fill-border"
        style={{ opacity: 0.33 }}
        d="M199,52.6c-5.7-6.1,4.4-20.6,4.4-20.6"
      />
      <path
        fill="none"
        stroke="#BABABA"
        d="M170.7,162.3c-9.8,1.7-17.1,1-17.1,3.2c0,2.2-4,8.7-4,9.7"
      />
      <path
        fill="none"
        d="M222.9,105.7c-6.7,11.6-21.4,13.9-27.7,5.4c-5.4-7.3-6.7-17.5,1.4-28.2s17.4-13,23.8-5.7
		C227,84.6,226.3,99.7,222.9,105.7z"
      />
      <path
        fill="none"
        d="M177.7,123c-7.2,11.4-21.6,14.2-30.1,7.8c-8.5-6.4-8.7-20.3-0.6-31S167.1,84,175.1,91
		C183.6,98.3,183.3,114.2,177.7,123z"
      />
      <path
        className="fill-none stroke-foreground"
        d="M118.1,139
		c-8.2-19.8,4.2-48.6,6.2-56.8c2-8.2,1.4-23.4,1.4-23.4s9.6,9.3,15.8,7.3c6.2-2,13.8-5.5,22.6-8.5c10.9-3.7,24.8-6.5,27.1-9.9
		S203.4,32,203.4,32s1.1,18.9,3.7,22.3c2.5,3.4,16.2,14.4,18.4,33.3c1.9,16.6-0.8,25.4-3.7,31.9c0,0-7.6,25.4-29.1,36.4
		C165.3,170,126.6,161,118.1,139z"
      />
      <path
        className="fill-none stroke-foreground"
        d="M192.6,155.9
		c-21.5,9.6-48.6,6.5-53.9-13.8c0,0,8.8,1.4,16.7,0.6c7.9-0.8,17.8-2.8,17.8-2.8s9,9.9,19.5,4.8c10.4-5.1,13.3-15.8,13.3-15.8
		s5.2-3.2,9.2-6.5s9-9.7,9-9.7"
      />

      <ellipse
        transform="matrix(0.9722 -0.2341 0.2341 0.9722 -24.6986 48.2225)"
        className="fill-none stroke-foreground"
        cx="190.8"
        cy="128.2"
        rx="9.4"
        ry="10.2"
      />
      <path
        fill="none"
        stroke="#EDEDED"
        d="M185.9,134c-1.1-1.1-1.9-2.5-2.3-4.1c-1-4.3,1.4-8.5,5.3-9.5
		c2.5-0.6,5,0.2,6.8,2"
      />
      <path className="fill-none stroke-foreground" d="M139.4,158.2" />
      <path
        className="fill-none stroke-foreground"
        d="M227.5,185.2
		l-7.5,5.3c-2.5,1.4-6-0.1-8-3.5c-1.9-3.3-1.5-7.2,1-8.6l7.8-5.5c0,0,6-4.1,8.1,0.5"
      />
      <path
        className="fill-border"
        d="M221.4,186.7l-2.9,2c-0.9,0.5-2.3,0-3-1.3c-0.7-1.3-0.6-2.7,0.4-3.3l3-2.1c0,0,2.3-1.5,3.1,0.2"
      />
      <path
        className="fill-border"
        d="M228.3,198.8l-2.9,2c-0.9,0.5-2.3,0-3-1.3c-0.7-1.3-0.6-2.7,0.4-3.3l3-2.1c0,0,2.3-1.5,3.1,0.2"
      />
      <path
        className="fill-border"
        d="M233.6,209.2l-2.9,2c-0.9,0.5-2.2,0.1-2.9-1.1c-0.7-1.1-0.4-2.5,0.5-3l3-2.1c0,0,2.3-1.5,3,0"
      />
      <path
        className="fill-none stroke-foreground"
        d="M227.5,185.2
		l-7.8,5.5c-2.5,1.4-2.9,5.3-1,8.6s5.5,4.9,8,3.5l7.2-4.9"
      />
      <path
        className="fill-none stroke-foreground"
        d="M233.8,197.9
		l-7.8,5.5c-2.5,1.4-4,6.2-1,8.6c1.4,1.2,3.7,1,5.9,0.6"
      />
      <path
        className="fill-none stroke-foreground"
        d="M136.8,217.7
		l9.4-2.8c2.8-1.1,4-4.9,2.6-8.5s-4.9-5.6-7.7-4.5l-9.7,2.9c0,0-7.3,2.3-5.1,6.8"
      />
      <path
        className="fill-border"
        d="M142.2,212.9l3.1-0.9c0.9-0.4,1.3-1.6,0.8-2.8c-0.5-1.2-1.6-1.8-2.5-1.5l-3.2,0.9c0,0-2.4,0.8-1.7,2.2"
      />
      <path
        className="fill-border"
        d="M134.9,338.2l0.7,3.1c0.3,0.9,1.5,1.4,2.7,1s1.9-1.5,1.6-2.4l-0.8-3.2c0,0-0.6-2.4-2.1-1.8"
      />
      <path
        className="fill-border"
        d="M210.9,311.1l0.7,3.1c0.3,0.9,1.5,1.4,2.7,1s1.9-1.5,1.6-2.4l-0.8-3.2c0,0-0.6-2.4-2.1-1.8"
      />
      <path
        className="fill-border"
        d="M224.2,307.5l0.6,3.1c0.3,1,1.5,1.5,2.7,1.1c1.2-0.3,2-1.4,1.7-2.3l-0.6-3.3c0,0-0.5-2.5-2-1.9"
      />
      <path
        className="fill-border"
        d="M234.5,302.3l-0.2,3.2c0,1,1,1.8,2.1,1.8c1.2,0,2.1-0.8,2.1-1.8l0.3-3.3c0,0,0.1-2.5-1.4-2.4"
      />
      <path
        className="fill-border"
        d="M147.4,335.9l0.7,3.1c0.3,0.9,1.5,1.4,2.7,1s1.9-1.5,1.6-2.4l-0.8-3.2c0,0-0.6-2.4-2.1-1.8"
      />
      <path
        className="fill-border"
        d="M159.9,329.9l0.7,3.1c0.3,0.9,1.5,1.4,2.7,1s1.9-1.5,1.6-2.4l-0.8-3.2c0,0-0.6-2.4-2.1-1.8"
      />
      <path
        className="fill-border"
        d="M145,226.5l3.1-0.9c0.9-0.4,1.3-1.6,0.8-2.8s-1.6-1.8-2.5-1.5l-3.2,0.9c0,0-2.4,0.8-1.7,2.2"
      />
      <path
        className="fill-border"
        d="M143.2,240.3l3.1-0.9c0.9-0.4,1.3-1.6,0.8-2.8c-0.5-1.2-1.6-1.8-2.5-1.5l-3.2,0.9c0,0-2.4,0.8-1.7,2.2"
      />
      <path
        className="fill-none stroke-foreground"
        d="M133.4,218.7
		l9.7-2.9c2.8-1.1,6.3,0.9,7.7,4.5s0.3,7.4-2.6,8.5l-8.9,2.7"
      />
      <path
        className="fill-none stroke-foreground"
        d="M132.1,233.7l9.7-3
		c2.8-1.1,6.1,0.5,7.4,3.7c1.2,3.1,0.4,4.8-1,6.4c0,0-4.6,4.8-11.8,5.7"
      />
      <path
        className="fill-border"
        style={{ opacity: 0.33 }}
        d="M165.5,85.6c-4.5-2.3-12.6,0.2-17.9,5c-9.9,9-8.8,20.3-8.8,20.3s4.9-10,12.2-15.6
		C158.5,89.6,165.5,85.6,165.5,85.6z"
      />
      <path
        fill="none"
        stroke="#BABABA"
        d="M209.9,182.1
		c-6-4.6-13-7.2-20.5-7.2c-12.8,0-21.7,7.2-29.6,16.6c0,0-3.7,5.4-13.7,6.5"
      />
      <path
        className="fill-none stroke-foreground"
        d="M150.8,161.5
		c0,0-0.6,4-1.7,6s-2.7,5.9-2.7,6.9s4.3,4,4.4,5.5c0,1.6,2.1,5.3,2.8,5.3c6.3,0,20.4-14,26.4-16.2c0,0,7.9-2,12.2-1.3
		c4.4,0.7,11.9,0.5,14.7-1.2c2.8-1.7,2.8-5.1,3.9-7.1s2.6-5,2.6-5s-3.1-4.3-4-6.2c-0.8-2-3-2.8-3.3-2.5"
      />

      <line
        className="fill-none stroke-foreground"
        x1="179.9"
        y1="168.9"
        x2="179.9"
        y2="160.7"
      />

      <line
        className="fill-none stroke-foreground"
        x1="188.3"
        y1="157.3"
        x2="188.3"
        y2="167.3"
      />
      <path
        className="fill-none stroke-foreground"
        d="M140.7,326.4
		c-1.1-2.5,0.5-5.6,3.6-7s6.4-0.3,7.5,2.2"
      />
      <path
        className="fill-none stroke-foreground"
        d="M129.6,331.2
		c-1.1-2.5,0.5-5.6,3.6-7s6.4-0.3,7.5,2.2l2.4,13.3"
      />
      <path
        className="fill-none stroke-foreground"
        d="M163.4,318.3
		c-1.1-2.5-4.4-3.5-7.5-2.2s-4.7,4.4-3.6,7l4.6,11.1"
      />
      <path
        className="fill-none stroke-foreground"
        d="M163.4,318.3
		c0,0,7.5,11.7,3.3,17.8"
      />
      <g>
        <path
          className="fill-none stroke-foreground"
          d="M228.6,293.6
			c-0.6-2.7-3.7-4.3-6.9-3.6s-5.4,3.4-4.8,6.1"
        />
        <path
          className="fill-none stroke-foreground"
          d="M240.4,291.1
			c-0.6-2.7-3.7-4.3-6.9-3.6c-3.3,0.7-5.4,3.4-4.8,6.1l3,10.8"
        />
        <path
          className="fill-none stroke-foreground"
          d="M218.6,309
			l-1.5-11.4c-0.6-2.7-3.7-4.3-6.9-3.6c-3.3,0.7-5.4,3.4-4.8,6.1"
        />
      </g>
      <path
        className="fill-none stroke-border"
        d="M156.9,173.7c-0.4-2.1-0.8-3.9,0-4.8s8.1,0.5,19.2-2.4"
      />
      <path
        className="fill-none stroke-border"
        d="M210.2,155.1c-0.9-1.9-1.8-3.6-2.9-3.8s-6.2,5.3-16.7,9.8"
      />

      <ellipse
        transform="matrix(0.6044 -0.7967 0.7967 0.6044 -24.5256 173.4207)"
        className="fill-none stroke-foreground"
        cx="162.4"
        cy="111.4"
        rx="21.9"
        ry="17.3"
      />
      <path
        className="fill-none stroke-foreground"
        d="M220.6,103.4
		c-6.1,10.5-15.9,13.7-23.5,7.9c-7.6-5.8-7.9-18.3-0.5-27.9c7.3-9.7,16.8-11.2,22.6-4.6C225.1,85.6,223.7,98.1,220.6,103.4z"
      />
      <path
        className="fill-border"
        style={{ opacity: 0.25 }}
        d="M201.4,73.2c-2,4.2-9.9,6.5-11.9,14.1s-9.9-7.6-6.5-10.2C186.4,74.6,203.4,69,201.4,73.2z"
      />
      <path
        className="fill-foreground"
        d="M168,149.8c0.5-1,9.9,6.2,22.6,1.5c12.7-4.7,13.9-14.7,14.6-14.3c0.7,0.4-3,17.4-17.1,20.8S167.4,150.8,168,149.8z"
      />
      <g>
        <path
          className="fill-none stroke-foreground"
          strokeWidth="2"
          d="
			M172.9,143.2c0,0-4.8,4.3-13.8,2.1"
        />
        <path
          className="fill-none stroke-foreground"
          strokeWidth="2"
          d="
			M175.4,144.8c0,0-1.1,1.8-4.8,3"
        />
      </g>
      <g>
        <path
          className="fill-none stroke-foreground"
          strokeWidth="2"
          d="
			M208.3,130c0,0,8.1-2,10.9-4.6"
        />
        <path
          className="fill-none stroke-foreground"
          strokeWidth="2"
          d="
			M207.7,132.8c0,0,2.1,0.6,5.4,0"
        />
      </g>
      <path
        className="fill-border"
        style={{ opacity: 0.33 }}
        d="M189.7,105.6c-0.8-1.7-5.5,0-5.6,1.9s-0.6,4.6-1.3,7s11.9-0.4,10.9-2.3
		C192.6,110.3,190.5,107.3,189.7,105.6z"
      />
      <path
        className="fill-border"
        style={{ opacity: 0.33 }}
        d="M145.3,183.1c0,0-14.7,11.7-8.7,13.2S145.3,183.1,145.3,183.1z"
      />
      <path
        className="fill-border"
        style={{ opacity: 0.33 }}
        d="M127.6,303.6c0,0-0.8,19.2,1.5,19.2c2.3,0,12.8-19.6,7.9-19.6C132.1,303.2,127.6,303.6,127.6,303.6z"
      />
      <g className="fill-foreground">
        <path d="M198.5,199.7l-0.2-9.7c-0.3,0.2-0.9,0.6-1.2,0.8l0-1.4c0.7-0.5,1.4-1.2,1.7-1.8l1-0.5l0.2,11.9L198.5,199.7z" />
      </g>
      <g className="fill-foreground">
        <path d="M180.9,202.4l-0.2-9.7c-0.3,0.2-0.9,0.6-1.2,0.8l0-1.4c0.7-0.5,1.4-1.2,1.7-1.8l1-0.5l0.2,11.9L180.9,202.4z" />
        <path
          d="M183.7,201l0-0.1c0-1.8,0.7-3.7,2.1-6.4c1.1-2.2,1.4-2.8,1.4-4.1c0-0.9-0.2-1.6-1.1-1.2c-0.8,0.4-1.1,1.3-1.1,2.6
			l-1.5,0.7c0-1.8,0.6-3.9,2.6-4.9c1.8-0.9,2.6,0.1,2.6,2c0,1.5-0.3,2.4-1.6,4.7c-1,1.8-1.6,3.2-1.8,4.2l3.8-1.8l-0.2,1.7L183.7,201
			z"
        />
      </g>
      <g className="fill-foreground">
        <path
          d="M186.7,274.2c0-0.3-0.1-1.2-1-0.8c-1.2,0.6-1.2,2.9-1.2,4.4c0.3-0.7,0.8-1.5,1.6-1.9c1.4-0.7,2.3,0.2,2.4,2.6
			c0,2.3-0.6,4.6-2.7,5.6c-2.2,1.1-2.8-1-2.9-4.4c-0.1-3.9,0.5-6.8,2.8-7.9c1.9-0.9,2.4,0.6,2.4,1.6L186.7,274.2z M187,279.5
			c0-1.7-0.4-2.3-1.2-1.8c-0.9,0.4-1.2,1.5-1.2,2.7c0,1.6,0.4,2.8,1.3,2.3C186.6,282.2,187,281.1,187,279.5z"
        />
      </g>
      <g className="fill-foreground">
        <path
          d="M159.4,253.3c0.1,0.4,0.2,1.1,1,0.7c1.3-0.6,1.2-3.4,1.2-4.8c-0.3,0.9-0.9,1.4-1.6,1.8c-1.4,0.7-2.3-0.1-2.4-2.4
			c0-2.5,0.9-4.4,2.6-5.3c1.8-0.9,2.7,0.1,2.8,3.8c0.1,5.2-0.6,7.4-2.8,8.5c-2.3,1.1-2.4-1.1-2.5-1.5L159.4,253.3z M159.2,247.6
			c0,1.4,0.4,2,1.2,1.6c0.8-0.4,1.1-1.3,1.1-2.6c0-1.3-0.2-2.3-1.2-1.8C159.6,245.2,159.2,246.2,159.2,247.6z"
        />
      </g>
      <g className="fill-foreground">
        <path d="M167.1,215l-0.2-9.7c-0.3,0.2-0.9,0.6-1.2,0.8l0-1.4c0.7-0.5,1.4-1.2,1.7-1.8l1-0.5l0.2,11.9L167.1,215z" />
        <path d="M170.9,213.2l-0.2-9.7c-0.3,0.2-0.9,0.6-1.2,0.8l0-1.4c0.7-0.5,1.4-1.2,1.7-1.8l1-0.5l0.2,11.9L170.9,213.2z" />
      </g>
      <g className="fill-foreground">
        <path d="M171.9,273l0,1.5c-1.2,3.3-2.2,7.7-2.5,11.7l-1.6,0.8c0.4-4.1,1.5-8.8,2.6-11.6l-3.5,1.7l0-1.6L171.9,273z" />
      </g>
      <g className="fill-foreground">
        <path
          d="M203.7,259.1l-3.1,1.5c0,0.9-0.1,2.5-0.2,3.1c0.3-0.5,0.7-1,1.4-1.4c1.6-0.8,2.4,0.4,2.4,2.5c0,2.4-0.5,4.7-2.8,5.8
			c-1.8,0.9-2.6-0.1-2.7-1.9l1.5-0.8c0.1,0.8,0.3,1.6,1.2,1.1c1-0.5,1.2-1.7,1.2-3.2c0-1.5-0.3-2.3-1.2-1.8c-0.7,0.4-1,1.1-1.2,1.9
			l-1.4,0.4c0.2-1.5,0.4-5.1,0.4-6.8l4.5-2.2L203.7,259.1z"
        />
      </g>
      <g className="fill-foreground">
        <path d="M159.4,236.3l-0.2-9.7c-0.3,0.2-0.9,0.6-1.2,0.8l0-1.4c0.7-0.5,1.4-1.2,1.7-1.8l1-0.5l0.2,11.9L159.4,236.3z" />
        <path
          d="M167.9,226c0.1,4.5-0.7,6.6-2.7,7.6c-2,1-2.8-0.5-2.9-4.9c-0.1-4.7,1-6.5,2.7-7.3C166.9,220.5,167.9,221.5,167.9,226z
			 M164,227.9c0.1,3.1,0.3,4.6,1.3,4.1c1-0.5,1.2-2.1,1.1-5.3c-0.1-3.3-0.3-4.3-1.3-3.8C164.2,223.4,163.9,224.7,164,227.9z"
        />
      </g>
      <g className="fill-foreground">
        <path
          d="M204.4,213.4l0-0.1c0-1.8,0.7-3.7,2.1-6.4c1.1-2.2,1.4-2.8,1.4-4.1c0-0.9-0.2-1.6-1.1-1.2c-0.8,0.4-1.1,1.3-1.1,2.6
			l-1.5,0.7c0-1.8,0.6-3.9,2.6-4.9c1.8-0.9,2.6,0.1,2.6,2c0,1.5-0.3,2.4-1.6,4.7c-1,1.8-1.6,3.2-1.8,4.2l3.8-1.8l-0.2,1.7
			L204.4,213.4z"
        />
      </g>
      <g className="fill-foreground">
        <path
          d="M159.1,272.1c0-1.8,0.7-2.9,1.2-3.5c-0.6-0.2-1-0.8-1-2c0-1.8,0.8-3.6,2.5-4.4c1.5-0.8,2.5-0.1,2.5,1.8
			c0,1.5-0.4,2.6-0.9,3.1c0.6,0,1.2,0.6,1.3,2.4c0,2.1-0.9,4-2.7,4.9C160.1,275.3,159.2,274.3,159.1,272.1z M163.1,270.2
			c0-1.5-0.4-1.9-1.3-1.5c-0.9,0.4-1.2,1.3-1.2,2.7c0,1.3,0.4,2,1.3,1.5C162.8,272.5,163.1,271.5,163.1,270.2z M160.7,265.9
			c0,1.2,0.3,1.7,1.1,1.3c0.7-0.3,1-1.1,1-2.3c0-1-0.3-1.6-1.1-1.2S160.7,264.9,160.7,265.9z"
        />
      </g>
      <g className="fill-foreground">
        <path
          d="M208.7,251.3l-0.1-2.9l-3.5,1.7l0-1.5l2.8-8.8l2-1l0.1,7.4l0.9-0.4l-0.1,1.6l-0.8,0.4l0.1,2.9L208.7,251.3z M208.5,244.1
			c0-1.2,0-2.2,0-3.2c-0.3,1.5-1.4,4.9-2,6.9l2-1L208.5,244.1z"
        />
      </g>
      <g className="fill-foreground">
        <path
          d="M206.3,224c0-1.4,0.5-3.5,2.5-4.5c1.7-0.8,2.5,0,2.5,1.8c0,1.5-0.5,2.5-1.1,3.1l0,0c0.8-0.1,1.5,0.4,1.5,2.2
			c0,2-0.6,4-2.7,5.1c-1.8,0.9-2.6-0.1-2.7-1.9l1.5-0.7c0.1,0.8,0.4,1.6,1.2,1.1c1-0.5,1.2-1.5,1.2-2.8c0-1.5-0.5-1.9-1.6-1.3
			l-0.4,0.2l0-1.5l0.4-0.2c0.9-0.5,1.4-1,1.3-2.4c0-1-0.2-1.5-1-1.1c-0.9,0.4-1,1.6-1,2.2L206.3,224z"
        />
      </g>
      <g>
        <path
          className="fill-none stroke-border"
          strokeWidth="2"
          d="
			M215.2,208.6c0.3-15.5-7.4-36-30.2-24.9l-2.7,1.3c-22.7,11.1-29.5,38.7-28.7,53.7l0.5,26.2c-0.3,15.5,7.4,36,30.2,24.9l2.7-1.3
			c22.7-11.1,29.5-38.7,28.7-53.7L215.2,208.6z"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="212.6"
          y1="223.1"
          x2="215.5"
          y2="221.7"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="153.9"
          y1="251.9"
          x2="156.8"
          y2="250.4"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="183.8"
          y1="188.1"
          x2="183.7"
          y2="184.4"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="185.7"
          y1="289.2"
          x2="185.6"
          y2="285.3"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="167.3"
          y1="202"
          x2="165.8"
          y2="199"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="157.5"
          y1="225.6"
          x2="154.8"
          y2="224.4"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="200.5"
          y1="185.7"
          x2="201.9"
          y2="181.3"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="210.9"
          y1="199.4"
          x2="213.6"
          y2="195.7"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="168.9"
          y1="287.9"
          x2="167.5"
          y2="292.3"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="158.4"
          y1="274.2"
          x2="155.8"
          y2="277.9"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="202.1"
          y1="271.6"
          x2="203.6"
          y2="274.6"
        />

        <line
          className="fill-none stroke-border"
          strokeWidth="2"
          x1="211.8"
          y1="248"
          x2="214.5"
          y2="249.1"
        />
      </g>
      <polygon
        id="minute"
        className="fill-border"
        style={{
          transformOrigin: '185px 236px',
          transform: `rotate(${(minutes + 0.9) * 360}deg)`,
        }}
        points="184.7,236.8 196.2,217.4 197.7,218 204.4,209.6 205.1,210.4 198.8,219 199.2,221.5 	"
      />
      <g
        id="hour"
        style={{
          transformOrigin: '185px 236px',
          transform: `rotate(${(hours + 0.2) * 360}deg)`,
        }}
      >
        <path
          className="fill-none stroke-border"
          strokeWidth="3"
          d="
			M184.7,236.8l-18.6-8l2.9,2.7c0,0-1,2.3,0.3,3.2c1.4,0.9,3.5-1.1,3.5-1.1L184.7,236.8z"
        />
        <path
          className="fill-none stroke-border"
          strokeWidth="3"
          d="
			M184.7,236.8l-10.1-6.3c0,0,0.5-2.2-1.1-2.9c-2.1-1-3.2,1.4-3.2,1.4l-4.1-0.3"
        />
      </g>
      <path
        className="fill-none stroke-border"
        d="M121.8,199.7
		c0,0-6.2,4.5-5.6,18.6s-2.8,26.5,7.9,29.4"
      />
    </g>
    <g className="fill-foreground">
      <g id="eyes1">
        <path d="M156.2,103.4c0,0-4.8,12.4-4.8,14.1c0,1.7,4.5,13.3,4.5,13.3s5.1-12,5.1-13.3C161,116.3,156.2,103.4,156.2,103.4z" />
        <path d="M205.6,87.9c0,0-4.8,12.4-4.8,14.1c0,1.7,4.5,11.9,4.5,11.9s5.1-10.6,5.1-11.9C210.4,100.7,205.6,87.9,205.6,87.9z" />
      </g>
      <g id="eyes2">
        <path
          display="inline"
          d="M158,103.4c0,0-4.8,12.4-4.8,14.1c0,1.7,4.5,13.3,4.5,13.3s5.1-12,5.1-13.3
		C162.8,116.3,158,103.4,158,103.4z"
        />
        <path
          display="inline"
          d="M207.2,87.9c0,0-4.8,12.4-4.8,14.1c0,1.7,4.5,11.9,4.5,11.9s5.1-10.6,5.1-11.9
		C212,100.7,207.2,87.9,207.2,87.9z"
        />
      </g>
      <g id="eyes3">
        <path
          display="inline"
          d="M159.5,103.4c0,0-3.8,12.4-3.8,14.1c0,1.7,3.5,13.3,3.5,13.3s6.1-12,6.1-13.3
		C165.3,116.3,159.5,103.4,159.5,103.4z"
        />
        <path
          display="inline"
          d="M208,88.3c0,0-3.8,12.4-3.8,14.1s3.5,11.9,3.5,11.9s6.1-10.6,6.1-11.9S208,88.3,208,88.3z"
        />
      </g>
      <g id="eyes4">
        <path
          display="inline"
          d="M160.2,103.4c0,0-2.8,12.4-2.8,14.1c0,1.7,3.5,13.3,3.5,13.3s6.1-12,6.1-13.3
		C167,116.3,160.2,103.4,160.2,103.4z"
        />
        <path
          display="inline"
          d="M208.6,87.4c0,0-2.8,12.4-2.8,14.1c0,1.7,3.5,11.9,3.5,11.9s6.1-10.6,6.1-11.9
		C215.4,100.3,208.6,87.4,208.6,87.4z"
        />
      </g>
      <g id="eyes5">
        <path
          display="inline"
          d="M162.3,103.4c0,0-2.8,12.4-2.8,14.1c0,1.7,3.5,13.3,3.5,13.3s6.1-12,6.1-13.3
		C169.1,116.3,162.3,103.4,162.3,103.4z"
        />
        <path
          display="inline"
          d="M210,87.4c0,0-2.8,12.4-2.8,14.1c0,1.7,3.5,11.9,3.5,11.9s6.1-10.6,6.1-11.9
		C216.8,100.3,210,87.4,210,87.4z"
        />
      </g>
      <g id="eyes6">
        <path
          display="inline"
          d="M164,103.4c0,0-2.8,12.4-2.8,14.1c0,1.7,3.5,13.3,3.5,13.3s6.1-13,6.1-14.3
		C170.8,115.3,164,103.4,164,103.4z"
        />
        <path
          display="inline"
          d="M211,87.4c0,0-2.8,12.4-2.8,14.1c0,1.7,3.5,11.9,3.5,11.9s6.1-11.6,6.1-12.9
		C217.8,99.3,211,87.4,211,87.4z"
        />
      </g>
      <g id="eyes7">
        <path
          display="inline"
          d="M165.4,103.4c0,0-2.8,12.4-2.8,14.1c0,1.7,3.9,12.4,3.9,12.4s5.7-12.2,5.7-13.4
		C172.2,115.3,165.4,103.4,165.4,103.4z"
        />
        <path
          display="inline"
          d="M212.4,87.4c0,0-2.8,12.4-2.8,14.1c0,1.7,3.1,10.7,3.1,10.7s5.7-11.2,5.7-12.4S212.4,87.4,212.4,87.4z"
        />
      </g>
      <g id="eyes8">
        <path
          display="inline"
          d="M167.1,102.9c0,0-2.8,12.4-2.8,14.1c0,1.7,2.9,12.4,2.9,12.4s6.7-12.2,6.7-13.4
		C173.9,114.7,167.1,102.9,167.1,102.9z"
        />
        <path
          display="inline"
          d="M213.5,86.7c0,0-2.8,12.4-2.8,14.1s3.1,10.7,3.1,10.7s5.7-11.2,5.7-12.4
		C219.5,97.7,213.5,86.7,213.5,86.7z"
        />
      </g>
      <g id="eyes9">
        <path
          display="inline"
          d="M168.6,102.9c0,0-2.8,12.4-2.8,14.1c0,1.7,2.8,11.9,2.8,11.9s6.8-11.6,6.8-12.9
		C175.4,114.7,168.6,102.9,168.6,102.9z"
        />
        <path
          display="inline"
          d="M214.6,86.7c0,0-2.8,12.4-2.8,14.1s2.8,10.2,2.8,10.2s6-10.7,6-12C220.7,97.7,214.6,86.7,214.6,86.7z"
        />
      </g>
      <g id="eyes10">
        <path
          display="inline"
          d="M170.2,102.1c0,0-2.8,12.4-2.8,14.1s3,11.5,3,11.5s6.6-11.2,6.6-12.5C177,114,170.2,102.1,170.2,102.1z"
        />
        <path
          display="inline"
          d="M215.6,85.7c0,0-2.8,12.4-2.8,14.1s2.6,10.6,2.6,10.6s6.2-11.1,6.2-12.3S215.6,85.7,215.6,85.7z"
        />
      </g>
      <g id="eyes11">
        <path
          display="inline"
          d="M171.3,101.3c0,0-2.8,12.4-2.8,14.1s3.3,10.9,3.3,10.9s6.3-10.6,6.3-11.9S171.3,101.3,171.3,101.3z"
        />
        <path
          display="inline"
          d="M216.7,85.5c0,0-2.8,12.4-2.8,14.1s2.2,9.8,2.2,9.8s6.6-10.3,6.6-11.6C222.7,96.6,216.7,85.5,216.7,85.5z
		"
        />
      </g>
      <g id="eyes12">
        <path
          display="inline"
          d="M172.3,100.6c0,0-2.7,12-2.7,13.7s2.4,11.8,2.4,11.8s7.2-11.6,7.2-12.8S172.3,100.6,172.3,100.6z"
        />
        <path
          display="inline"
          d="M217.3,85.2c0,0-2.4,11.7-2.4,13.4s1.9,9.6,1.9,9.6s6.2-7.8,6.4-11.6C223.2,94,217.3,85.2,217.3,85.2z"
        />
      </g>
      <g id="eyes13">
        <path
          display="inline"
          d="M173.8,100.4c0,0-2.7,12-2.7,13.7c0,1.7,2.2,11.2,2.2,11.2s7.4-10.9,7.4-12.2
		C180.7,111.9,173.8,100.4,173.8,100.4z"
        />
        <path
          display="inline"
          d="M218.3,84.8c0,0-2.4,11.7-2.4,13.4s1.5,9.8,1.5,9.8s5.9-8.4,6-12.2C223.5,93.1,218.3,84.8,218.3,84.8z"
        />
      </g>
      <g id="eyes14">
        <path
          display="inline"
          d="M173.8,100.4c0,0-0.7,11.4-0.7,13.1c0,1.7,0.2,11.9,0.2,11.9s8.5-8.8,7.5-12
		C175.8,96.2,173.8,100.4,173.8,100.4z"
        />
        <path
          display="inline"
          d="M218.3,84.9c0,0-1.1,11.5-1.1,13.2s1.1,8.8,1.1,8.8s5-5.3,5.1-11.9C223.6,83.8,218.3,84.9,218.3,84.9z"
        />
      </g>
      <g id="eyes15">
        <path
          display="inline"
          d="M174.6,100c0,0-0.7,11.4-0.7,13.1s0.6,10.5,0.6,10.5s7.1-10.2,6.6-12.2C177.5,95.8,174.6,100,174.6,100z"
        />
        <path
          display="inline"
          d="M219.5,84.5c0,0-1.1,11.5-1.1,13.2s0.6,8.5,0.6,8.5s3.9-4.7,4.1-11.3C223.6,81.5,219.5,84.5,219.5,84.5z"
        />
      </g>
    </g>
  </svg>
);

const Clock = styled(ClockIllustration)`
  margin-left: calc(0px - ${(props) => props.theme.spacing});

  #tail {
    animation: tailframes 0.7s linear infinite alternate;
  }

  #eyes1 {
    opacity: 0;
    animation: eyeframes1 0.7s steps(1) infinite alternate;
  }

  #eyes2 {
    opacity: 0;
    animation: eyeframes2 0.7s steps(1) infinite alternate;
  }

  #eyes3 {
    opacity: 0;
    animation: eyeframes3 0.7s steps(1) infinite alternate;
  }

  #eyes4 {
    opacity: 0;
    animation: eyeframes4 0.7s steps(1) infinite alternate;
  }

  #eyes5 {
    opacity: 0;
    animation: eyeframes5 0.7s steps(1) infinite alternate;
  }

  #eyes6 {
    opacity: 0;
    animation: eyeframes6 0.7s steps(1) infinite alternate;
  }

  #eyes7 {
    opacity: 0;
    animation: eyeframes7 0.7s steps(1) infinite alternate;
  }

  #eyes8 {
    opacity: 0;
    animation: eyeframes8 0.7s steps(1) infinite alternate;
  }

  #eyes9 {
    opacity: 0;
    animation: eyeframes9 0.7s steps(1) infinite alternate;
  }

  #eyes10 {
    opacity: 0;
    animation: eyeframes10 0.7s steps(1) infinite alternate;
  }

  #eyes11 {
    opacity: 0;
    animation: eyeframes11 0.7s steps(1) infinite alternate;
  }

  #eyes12 {
    opacity: 0;
    animation: eyeframes12 0.7s steps(1) infinite alternate;
  }

  #eyes13 {
    opacity: 0;
    animation: eyeframes13 0.7s steps(1) infinite alternate;
  }

  #eyes14 {
    opacity: 0;
    animation: eyeframes14 0.7s steps(1) infinite alternate;
  }

  #eyes15 {
    opacity: 0;
    animation: eyeframes15 0.7s steps(1) infinite alternate;
  }

  @keyframes eyeframes1 {
    0% {
      opacity: 1;
    }
    6% {
      opacity: 0;
    }
  }

  @keyframes eyeframes2 {
    6% {
      opacity: 1;
    }
    12% {
      opacity: 0;
    }
  }

  @keyframes eyeframes3 {
    12% {
      opacity: 1;
    }
    18% {
      opacity: 0;
    }
  }

  @keyframes eyeframes4 {
    18% {
      opacity: 1;
    }
    24% {
      opacity: 0;
    }
  }

  @keyframes eyeframes5 {
    24% {
      opacity: 1;
    }
    30% {
      opacity: 0;
    }
  }

  @keyframes eyeframes6 {
    30% {
      opacity: 1;
    }
    36% {
      opacity: 0;
    }
  }

  @keyframes eyeframes7 {
    36% {
      opacity: 1;
    }
    42% {
      opacity: 0;
    }
  }

  @keyframes eyeframes8 {
    42% {
      opacity: 1;
    }
    48% {
      opacity: 0;
    }
  }

  @keyframes eyeframes9 {
    48% {
      opacity: 1;
    }
    54% {
      opacity: 0;
    }
  }

  @keyframes eyeframes10 {
    54% {
      opacity: 1;
    }
    60% {
      opacity: 0;
    }
  }

  @keyframes eyeframes11 {
    60% {
      opacity: 1;
    }
    66% {
      opacity: 0;
    }
  }

  @keyframes eyeframes12 {
    66% {
      opacity: 1;
    }
    72% {
      opacity: 0;
    }
  }

  @keyframes eyeframes13 {
    72% {
      opacity: 1;
    }
    78% {
      opacity: 0;
    }
  }

  @keyframes eyeframes14 {
    78% {
      opacity: 1;
    }
    85% {
      opacity: 0;
    }
  }

  @keyframes eyeframes15 {
    85% {
      opacity: 1;
    }
  }

  @keyframes tailframes {
    0% {
      transform: rotate(-40deg) scale(0.8);
    }

    100% {
      transform: rotate(10deg) scale(1);
    }
  }
`;

const Example = styled.section``;

const ClockExample: FC = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  return (
    <Example>
      <Controls>
        <Control>
          hours
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.01"
            value={hours}
            onChange={(e) => setHours(e.target.valueAsNumber)}
          />
          {hours}
        </Control>
        <Control>
          minutes
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.01"
            value={minutes}
            onChange={(e) => setMinutes(e.target.valueAsNumber)}
          />
          {minutes}
        </Control>
      </Controls>
      <Clock hours={hours} minutes={minutes} />
    </Example>
  );
};

export default ClockExample;
