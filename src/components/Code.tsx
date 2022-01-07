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

import React, { FC, useState, useRef, useCallback } from 'react';
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
  margin-left: ${(props) => props.theme.spacingHalf};
  margin-right: calc(
    -30% - ${RULER_ENDMARK_WIDTH}px - ${(props) => props.theme.borderThick} - ${(props) => props.theme.spacingOneAndHalf}
  );
  padding-right: calc(
    30% + ${RULER_ENDMARK_WIDTH}px + ${(props) => props.theme.borderThick} +
      ${(props) => props.theme.spacingOneAndHalf}
  );

  .stroke-foreground {
    stroke: ${(props) =>
      props.isCodeDark
        ? props.isDark
          ? props.theme.foregroundColor
          : props.theme.backgroundColor
        : props.theme.foregroundColor};
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: ${(props) => props.theme.spacingOneAndHalf};
    width: calc(${(props) => props.theme.border} * 1.5);
    height: 100%;
    background: ${(props) => props.theme.foregroundColor};
    opacity: 0.4;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
    z-index: -1;
  }

  &:hover {
    &:after {
      opacity: 1;
    }

    button {
      opacity: 1;
    }
  }

  @media (max-width: ${(props) => props.theme.mobile}) {
    margin-right: ${(props) => props.theme.spacingHalf};
    margin-left: ${(props) => props.theme.spacingHalf};
    padding-right: initial;

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
  font-size: ${(props) => props.theme.smallFontSize};
  padding: ${(props) => props.theme.spacingHalf};
  overflow-x: auto;
  background: none;
`;

const CodeToolbar = styled.div`
  position: absolute;
  display: flex;

  top: ${(props) => props.theme.spacingThird};
  right: calc(30% + ${(props) => props.theme.spacingHalf});

  border-radius: ${(props) => props.theme.borderThick};
  background: ${(props) =>
    props.theme.isDark
      ? `${props.theme.dropShadowDarkColor}D0`
      : `${props.theme.accentLightColor}D0`};

  @media (max-width: ${(props) => props.theme.mobile}) {
    left: initial;
    //right: ${(props) => props.theme.spacingQuarter};
    right: initial;
    padding-right: ${(props) => props.theme.spacingQuarter};
  }
`;

const ToolButton = styled.button`
  width: ${(props) => props.theme.spacing};
  height: ${(props) => props.theme.spacing};
  margin-right: ${(props) => props.theme.spacingQuarter};
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  opacity: 0;
  transition: opacity ${(props) => props.theme.animationFast} ease-out;

  @media (max-width: ${(props) => props.theme.mobile}) {
    opacity: 1;
  }
`;

type CodeButtonProps = {
  tipId: string;
  tipRef: React.MutableRefObject<HTMLElement>;
  showTip: (id: string) => void;
  hideTip: () => void;
  onClick: () => void;
};

const CodeButton: FC<CodeButtonProps> = ({
  children,
  tipId,
  tipRef,
  showTip,
  hideTip,
  onClick,
}) => {
  const { showTip: showTargetTip, targetRef } = useTooltipTarget({
    tooltipElement: tipRef.current,
    showTip,
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 10,
    placement: 'top',
  });

  const showTooltip = useCallback(() => showTargetTip(tipId), [
    showTargetTip,
    tipId,
  ]);

  return (
    <ToolButton
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
  const darkOverride =
    typeof window !== 'undefined'
      ? localStorage.getItem(DARK_MODE_OVERRIDE) == '1'
      : false;
  const snippetRef = useRef<HTMLElement>(null);
  const { isDark } = useStyledDarkMode();
  const [isCopied, setCopied] = useState(false);
  const [isCodeDark, setCodeDark] = useState(isDark || darkOverride);

  const {
    showTip,
    hideTip,
    tooltipText: tipId,
    tipProps,
    tipRef,
  } = useTooltipController();

  const copyCode = useCallback(() => {
    if (snippetRef.current) {
      try {
        hideTip();
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
      hideTip();

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
        theme={isDark || isCodeDark ? dark : light}
        code={(children as React.ReactElement).props.children}
        language={
          matches && matches.groups && matches.groups.lang
            ? matches.groups.lang
            : ''
        }
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <>
            <Pre className={className} style={style}>
              <span ref={snippetRef}>
                {tokens
                  .filter((line) =>
                    line.length === 1 && line[0].empty ? false : true
                  )
                  .map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
              </span>
            </Pre>
            <CodeToolbar>
              <CodeButton
                tipId={'copy'}
                tipRef={tipRef}
                onClick={copyCode}
                showTip={showTip}
                hideTip={hideTip}
              >
                <CopyIcon />
              </CodeButton>
              {!isDark && (
                <CodeButton
                  tipId={'mode'}
                  tipRef={tipRef}
                  onClick={toggleDarkMode}
                  showTip={showTip}
                  hideTip={hideTip}
                >
                  {isCodeDark ? <LightIcon /> : <DarkIcon />}
                </CodeButton>
              )}
            </CodeToolbar>
          </>
        )}
      </Highlight>
      <Tooltip {...tipProps} role="tooltip">
        {tipId === 'copy' && (isCopied ? 'copied!' : 'copy code')}
        {tipId === 'mode' && (isCodeDark ? 'light theme' : 'dark theme')}
        <Arrow />
      </Tooltip>
    </CodeWrapper>
  );
};

export default Code;
