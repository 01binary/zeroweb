import React, { FC } from 'react';
import styled, { useTheme } from 'styled-components';

const ButtonWrapper = styled.button`
  position: relative;
  border: none;
  cursor: pointer;
  height: 44px;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  display: flex;
  align-items: center;

  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  svg,
  span {
    pointer-events: none;
  }

  .button__left {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 15px;
  }

  .button__right {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 15px;
  }

  .button__middle,
  .button__middle-pushed,
  .button__middle-normal {
    position: absolute;
    top: 0;
    left: 15px;
    bottom: 0;
    width: calc(100% - 29px);
  }

  .button__middle-normal {
    opacity: 1;
  }

  .button__middle-pushed {
    opacity: 0;
  }

  .button__middle-focus {
    position: absolute;
    top: 0;
    left: 15px;
    bottom: 0;
    width: calc(100% - 29px);
    opacity: 0;
  }

  .button__label {
    z-index: 1;
    padding: 0 15px;
    color: ${(props) => props.theme.foregroundColor};
  }

  .highlight {
    fill: none;
    stroke: ${(props) => props.theme.accentLightColor};
  }

  .shadow {
    fill: none;
    stroke: ${(props) =>
      props.theme.isDark
        ? props.theme.dropShadowDarkColor
        : props.theme.dropShadowLightColor};
  }

  .border {
    fill: none;
    stroke: ${(props) => props.theme.dropShadowDarkColor};
  }

  .border-background {
    fill: url('#normal_button_gradient');
    stroke: ${(props) => props.theme.dropShadowDarkColor};
  }

  .focus {
    fill: none;
    stroke: ${(props) => props.theme.focusColor};
    opacity: 0;
  }

  &:focus {
    outline: none;
    border-radius: initial;
    box-shadow: initial;

    .focus {
      opacity: 1;
    }

    .button__middle-focus {
      opacity: 1;
    }
  }

  &:active {
    .button__label {
      color: ${(props) =>
        props.theme.isDark
          ? props.theme.secondaryTextColor
          : props.theme.backgroundColor};
    }

    .border-background {
      fill: url('#pushed_button_gradient');
    }

    .button__middle-normal {
      opacity: 0;
    }

    .button__middle-pushed {
      opacity: 1;
    }

    .highlight {
      stroke: ${(props) =>
        props.theme.isDark
          ? props.theme.dropShadowDarkColor
          : props.theme.dropShadowLightColor};
    }

    .shadow {
      stroke: ${(props) => props.theme.accentLightColor};
    }
  }
`;

type ButtonProps = {
  type?: string;
  disabled?: boolean;
  shared?: boolean;
  onClick: (e: any) => void;
};

export const ButtonResources: FC = () => {
  const theme = useTheme();
  return (
    <svg className="hide">
      <defs>
        <linearGradient
          id="normal_button_gradient"
          gradientTransform="rotate(90)"
        >
          <stop offset="0%" stopColor={theme.accentHighlightColor} />
          <stop offset="100%" stopColor={theme.accentLightShadowColor} />
        </linearGradient>
        <linearGradient
          id="pushed_button_gradient"
          gradientTransform="rotate(90)"
        >
          <stop offset="0%" stopColor={theme.accentDarkShadowColor} />
          <stop offset="100%" stopColor={theme.accentLightShadowColor} />
        </linearGradient>
      </defs>
    </svg>
  );
};

const Button: FC<ButtonProps> = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <ButtonWrapper {...props}>
      {props.shared ? null : <ButtonResources />}

      <svg
        className="button__left"
        width="15px"
        height="44px"
        viewBox="0 0 15 44"
      >
        <polyline
          className="border-background"
          strokeMiterlimit="10"
          points="15,2.5 13,2.5 2.5,13 2.5,41 3,41.5 15,41.5 "
        />
        <line
          className="shadow"
          strokeMiterlimit="10"
          x1="15"
          y1="40.5"
          x2="3"
          y2="40.5"
        />
        <polyline
          className="highlight"
          strokeMiterlimit="10"
          points="3.5,40 3.5,13.3 13.3,3.5 15,3.5 "
        />

        <polyline
          className="focus"
          strokeMiterlimit="10"
          strokeWidth="2"
          points="15,43 2.5,43 1,41.5 1,12.4 12.4,1 15,1 "
        />
      </svg>

      <svg className="button__middle-normal" height="44px">
        <symbol id="middleNormalRef">
          <rect
            fill="url(#normal_button_gradient)"
            y="4"
            x="0%"
            width="100%"
            height="36"
          />
        </symbol>
        <symbol id="middleRefBorderNormal">
          <line
            stroke={
              theme.isDark
                ? theme.dropShadowDarkColor
                : theme.dropShadowLightColor
            }
            strokeMiterlimit="10"
            x1="0%"
            y1="40.5"
            x2="100%"
            y2="40.5"
          />
          <line
            stroke={theme.accentLightColor}
            strokeMiterlimit="10"
            x1="0%"
            y1="3.5"
            x2="100%"
            y2="3.5"
          />
          <line
            stroke={theme.dropShadowDarkColor}
            strokeMiterlimit="10"
            x1="0%"
            y1="2.5"
            x2="100%"
            y2="2.5"
          />
          <line
            stroke={theme.dropShadowDarkColor}
            strokeMiterlimit="10"
            x1="0%"
            y1="41.5"
            x2="100%"
            y2="41.5"
          />
        </symbol>

        <use xlinkHref={`#middleRefBorderNormal`} />
        <use xlinkHref={`#middleNormalRef`} />
      </svg>

      <svg className="button__middle-pushed" height="44px">
        <symbol id="middlePushedRef">
          <rect
            fill="url(#pushed_button_gradient)"
            y="4"
            x="0%"
            width="100%"
            height="36"
          />
        </symbol>
        <symbol id="middleRefBorderPushed">
          <line
            stroke={theme.accentLightColor}
            strokeMiterlimit="10"
            x1="0%"
            y1="40.5"
            x2="100%"
            y2="40.5"
          />
          <line
            stroke={
              theme.isDark
                ? theme.dropShadowDarkColor
                : theme.dropShadowLightColor
            }
            strokeMiterlimit="10"
            x1="0%"
            y1="3.5"
            x2="100%"
            y2="3.5"
          />
          <line
            stroke={theme.dropShadowDarkColor}
            strokeMiterlimit="10"
            x1="0%"
            y1="2.5"
            x2="100%"
            y2="2.5"
          />
          <line
            stroke={theme.dropShadowDarkColor}
            strokeMiterlimit="10"
            x1="0%"
            y1="41.5"
            x2="100%"
            y2="41.5"
          />
        </symbol>

        <use xlinkHref={`#middleRefBorderPushed`} />
        <use xlinkHref={`#middlePushedRef`} />
      </svg>

      <svg className="button__middle-focus" height="44px">
        <symbol id="middleFocusRef">
          <line
            fill="none"
            stroke={theme.focusColor}
            strokeWidth="2"
            x1="0%"
            y1="43"
            x2="100%"
            y2="43"
          />
          <line
            fill="none"
            stroke={theme.focusColor}
            strokeWidth="2"
            x1="0%"
            y1="1"
            x2="100%"
            y2="1"
          />
        </symbol>

        <use xlinkHref="#middleFocusRef" />
      </svg>

      <svg
        className="button__right"
        width="15px"
        height="44px"
        viewBox="0 0 15 44"
      >
        <polyline
          className="border-background"
          strokeMiterlimit="10"
          points="0,41.5 2,41.5 12.5,31 12.5,2.5 0,2.5 "
        />
        <polyline
          className="shadow"
          strokeMiterlimit="10"
          points="11.5,4 11.5,30.7 1.7,40.5 0,40.5 "
        />
        <line
          className="highlight"
          strokeMiterlimit="10"
          x1="0"
          y1="3.5"
          x2="12"
          y2="3.5"
        />
        <polyline
          className="focus"
          strokeWidth="2"
          strokeMiterlimit="10"
          points="0,1 12.5,1 14,2.5 14,31.6 2.6,43 0,43 "
        />
      </svg>

      <span className="button__label">{children}</span>
    </ButtonWrapper>
  );
};

export default Button;
