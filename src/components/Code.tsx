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

import React, { FC, useState, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { useStyledDarkMode } from 'gatsby-styled-components-dark-mode';
import light from 'prism-react-renderer/themes/github';
import dark from 'prism-react-renderer/themes/vsDark';
import { useTooltipController, useTooltipTarget } from '../hooks/useTooltip';
import { Tooltip, Arrow } from './Tooltip';
import { RULER_ENDMARK_WIDTH } from './Ruler';
import CopyIcon from '../images/copy.svg';
import LightIcon from '../images/light.svg';
import DarkIcon from '../images/dark.svg';

const DARK_MODE_OVERRIDE = 'darkCode';

type CodeWrapperProps = {
  isDark: boolean;
  isCodeDark: boolean;
};

const CodeWrapper = styled.div<CodeWrapperProps>`
  position: relative;
  margin-left: ${props => props.theme.spacingHalf};
  margin-right: ${props => props.theme.spacingHalf};
  width: calc(130% + ${RULER_ENDMARK_WIDTH}px + ${props => props.theme.spacing} + 3px);

  .stroke-foreground {
    stroke: ${props => props.isCodeDark !== props.isDark ? props.theme.backgroundColor : props.theme.foregroundColor};
  }

  &:after {
    content: '';
    position: absolute;
    right: ${props => props.theme.spacingOneAndHalf};
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

  @media (max-width: ${props => props.theme.mobile}) {
    width: initial;

    &:after {
      display: none;
    }

    .code__ruler-marker {
      display: none;
    }
  }
`;

const Pre = styled.pre`
  position: relative;
  font-size: ${props => props.theme.smallFontSize};
  padding: ${props => props.theme.spacingHalf};
  width: calc(67% - ${props => props.theme.spacingHalf});

  &:hover {
    button {
      opacity: 1;
    }
  }

  @media (max-width: ${props => props.theme.mobile}) {
    width: initial;
  }
`;

type ToolButtonProps = {
  offset: number;
};

const ToolButton = styled.button<ToolButtonProps>`
  position: absolute;
  width: 32px;
  height: 32px;
  top: ${props => props.theme.spacingHalf};
  right: ${({ offset, theme }) => offset === 0 ? theme.spacingHalf : theme.spacingDouble};
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  opacity: 0;
  transition: opacity ${props => props.theme.animationFast} ease-out;
`;

type CodeButtonProps = {
  offset: number;
  tipId: string;
  tipRef: React.MutableRefObject<HTMLElement>;
  showTip: (id: string) => void;
  hideTip: () => void;
  onClick: () => void;
};

const CodeButton: FC<CodeButtonProps> = ({
  children,
  offset,
  tipId,
  tipRef,
  showTip,
  hideTip,
  onClick,
}) => {
  const {
    showTip: showTargetTip,
    targetRef
  } = useTooltipTarget({
    tooltipElement: tipRef.current,
    showTip,
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 10,
    placement: 'top'
  });

  const showTooltip = useCallback(
    () => showTargetTip(tipId),
  [showTargetTip, tipId]);

  return (
    <ToolButton
      offset={offset}
      ref={targetRef}
      onClick={onClick}
      onMouseOver={showTooltip}
      onMouseOut={hideTip}
    >
      {children}
    </ToolButton>
  );
};

const Code: FC = ({ children }) => {
  const darkOverride = localStorage.getItem(DARK_MODE_OVERRIDE) == '1';

  const snippetRef = useRef<HTMLElement>(null);
  const { isDark } = useStyledDarkMode();
  const [ isCopied, setCopied ] = useState(false);
  const [ isCodeDark, setCodeDark ] = useState(isDark || darkOverride);

  const {
    showTip,
    hideTip,
    tooltipText: tipId,
    tipProps,
    tipRef
  } = useTooltipController();

  const copyCode = useCallback(() => {
    if (snippetRef.current) {
      try {
        navigator.clipboard.writeText(snippetRef.current.innerText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      } catch (e) {
        console.error(e);
      }
    }
  }, [setCopied]);

  const toggleDarkMode = useCallback(() => {
    try {
      if (isDark === isCodeDark) {
        // Override dark mode
        localStorage.setItem(DARK_MODE_OVERRIDE, '1');
      } else {
        // Remove dark mode override
        localStorage.removeItem(DARK_MODE_OVERRIDE);
      }
    } catch (e) {
      console.error(e);
    }

    setCodeDark(!isCodeDark);

  }, [isDark, isCodeDark, setCodeDark]);

  const className = (children as React.ReactElement)?.props?.className || '';
  const matches = className.match(/language-(?<lang>.*)/);

  return (
    <CodeWrapper isDark={isDark} isCodeDark={isCodeDark}>
      <Highlight
        {...defaultProps}
        theme={(darkOverride ? isCodeDark : isDark) ? dark : light}
        code={(children as React.ReactElement).props.children}
        language={
        matches && matches.groups && matches.groups.lang
          ? matches.groups.lang
          : ''
        }
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          <span ref={snippetRef}>
            {tokens
              .filter((line) => line.length === 1 && line[0].empty ? false: true)
              .map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
            ))}
          </span>
          <CodeButton
            offset={0}
            tipId={'copy'}
            tipRef={tipRef}
            onClick={copyCode}
            showTip={showTip}
            hideTip={hideTip}
          >
            <CopyIcon />
          </CodeButton>
          <CodeButton
            offset={1}
            tipId={'mode'}
            tipRef={tipRef}
            onClick={toggleDarkMode}
            showTip={showTip}
            hideTip={hideTip}
          >
            {isCodeDark ? <LightIcon /> : <DarkIcon />}
          </CodeButton>
          <Tooltip {...tipProps} role="tooltip">
            {tipId === 'copy' && (isCopied ? 'copied!' : 'copy code')}
            {tipId === 'mode' && (isCodeDark ? 'light theme' : 'dark theme')}
            <Arrow />
          </Tooltip>
        </Pre>
        )}
      </Highlight>
    </CodeWrapper>
  );
};

export default Code;
