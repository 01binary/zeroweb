/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Code (pre) component used in markdown (MDX).
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React from 'react';
import styled from 'styled-components';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { useStyledDarkMode } from 'gatsby-styled-components-dark-mode';
import light from 'prism-react-renderer/themes/github';
import dark from 'prism-react-renderer/themes/vsDark';
import { RULER_OFFSET } from './Ruler';

const Pre = styled.pre`
  position: relative;
  padding: 16px;
  width: calc(100% - 3.25em);
  margin-left: ${props => props.theme.spacingHalf};
  margin-left: ${props => props.theme.spacingHalf};
  left: 0.5em;
  margin: auto;
  font-size: ${props => props.theme.smallFontSize};

  &:after {
    content: '';
    position: absolute;
    left: calc(100% + ${props => props.theme.spacingHalf} + ${props => props.theme.border} + ${props => props.theme.borderThick} + ${RULER_OFFSET}px);
    top: 0;
    width: calc(${props => props.theme.border} * 1.5);
    height: 100%;
    background: ${props => props.theme.foregroundColor};
    opacity: .4;
    transition: opacity ${props => props.theme.animationFast} ease-out;
  }

  &:hover {
    &:after {
      opacity: 1;
    }
  }

  @media(max-width: ${props => props.theme.mobile}) {
    margin-right: 1em;
  }
`;

const Code = (props: any) => {
  const { isDark, toggleDark } = useStyledDarkMode();
  const className = props.children.props.className || '';
  const matches = className.match(/language-(?<lang>.*)/);

  return (
    <Highlight
      {...defaultProps}
      theme={isDark ? dark : light}
      code={props.children.props.children}
      language={
      matches && matches.groups && matches.groups.lang
        ? matches.groups.lang
        : ''
      }
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <Pre className={className} style={style}>
        {tokens
          .filter((line) => line.length === 1 && line[0].empty ? false: true)
          .map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
        ))}
      </Pre>
      )}
    </Highlight>
  );
};

export default Code;
