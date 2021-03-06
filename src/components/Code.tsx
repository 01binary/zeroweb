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

const Pre = styled.pre`
  padding: 16px;
  font-size: ${props => props.theme.smallFontSize};
`;

const Code = (props: any) => {
  const className = props.children.props.className || '';
  const matches = className.match(/language-(?<lang>.*)/);

  return (
    <Highlight
      {...defaultProps}
      code={props.children.props.children}
      language={
      matches && matches.groups && matches.groups.lang
        ? matches.groups.lang
        : ''
      }
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <Pre className={className} style={style}>
        {tokens.map((line, i) => (
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
