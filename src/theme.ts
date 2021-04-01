import { createGlobalStyle } from 'styled-components';

const unit = 30;

const spacing = {
    unit: unit,
    border: '2px',
    spacing: `${unit}px`,
    spacingDouble: `${unit * 2}px`,
    spacingTriple: `${unit * 3}px`,
    spacingOneAndHalf: `${unit * 1.5}px`,
    spacingOneAndThird: `${unit * 4 / 3}px`,
    spacingFourThirds: `${unit / 4 / 3}px`,
    spacingThreeHalves: `${unit / 3 / 2}px`,
    spacingHalf: `${unit / 2}px`,
    spacingThird: `${unit / 3}px`,
    spacingQuarter: `${unit / 4}px`,
    spacingSmall: `${unit / 6}px`,
    spacingMin: `${unit / 12}px`,
    cornerSmall: `${unit / 3}px`,
    margin: `11.25pt`,
    wide: '1200px',
    desktop: '1080px',
    mobile: '1024px',
    column: '950px'
}

const typography = {
    titleFont: 'Consolas, Menlo, monospace',
    titleFontSize: '16pt',
    titleFontWeight: 'normal',

    headingFont: 'Open Sans, Helvetica Neue, Arial, sans-serif',
    headingFontWeight: 600,
    headingFontSizeLarge: '20pt',
    headingFontSizeMedium: '18pt',
    headingFontSizeSmall: '15pt',
    headingFontSizeSmaller: '14.375pt',

    normalFont: 'Open Sans, Arial, sans-serif',
    normalFontWeight: 400,
    normalFontSize: '15pt',
    normalFontLineHeight: '1.52em',
    navigationFontSize: '12.5pt',

    smallFont: 'Segoe UI, Verdana, sans-serif',
    smallFontWeight: 400,
    smallFontSize: '12.5pt',
    smallFontLineHeight: '21.25pt',

    smallestFontSize: '10pt',

    fallbackFont: 'sans-serif',
    backgroundFont: 'Arial',
};

const animations = {
    animationFast: '.3s',
    animationSlow: '.5s',
};

const sharedTheme = {
    ...spacing,
    ...typography,
    ...animations
};

export const lightTheme = {
    primaryColor: '#12C0E1',
    primaryHoverColor: '#19C9EA',
    primaryLightColor: '#71D3DB',
    primaryDarkColor: '#0E93AD',
    primaryDarkShadowColor: '#10A6C4',
    primaryTextColor: '#FFFFFF',

    secondaryColor: '#A158BA',
    secondaryTextColor: '#848D95',

    accentColor: '#E3EBEC',
    accentLightColor: '#F6F6F6',
    accentHighlightColor: '#FBFBFB',
    accentLightShadowColor: '#EBEBEB',
    accentDarkShadowColor: '#666666',
    accentShadowColor: '#898989',
    accentHoverColor: '#D7DFE0',
    accentTextColor: '#127191',

    foregroundColor: '#3B4A51',
    backgroundColor: '#FFFFFF',
    borderColor: '#AAAAAA',
    selectionColor: '#C3C3C3',

    shadowColor: '#D3D3D3',
    shadowDarkColor: '#595959',
    shadowLightColor: '#B5D9E3',

    dropShadowDarkColor: '#777777',
    dropShadowLightColor: '#999999',
    dropShadowTransparentColor: 'black',

    warningColor: '#E1B412',
    focusColor: '#FF008E',
    errorColor: '#BA141A',

    textSelectionColor: 'white',
    textSelectionBackground: '#FF008E',

    ...sharedTheme
};

export const darkTheme = {
  primaryColor: '#52545f',
  primaryHoverColor: '#19C9EA',
  primaryLightColor: '#71D3DB',
  primaryDarkColor: '#0E93AD',
  primaryDarkShadowColor: '#10A6C4',
  primaryTextColor: '#FFFFFF',

  secondaryColor: '#3e404b',
  secondaryTextColor: '#dde0df',

  accentColor: '#E3EBEC',
  accentLightColor: '#F6F6F6',
  accentHighlightColor: '#FBFBFB',
  accentLightShadowColor: '#EBEBEB',
  accentDarkShadowColor: '#666666',
  accentShadowColor: '#898989',
  accentHoverColor: '#D7DFE0',
  accentTextColor: '#127191',

  foregroundColor: '#ffffff',
  backgroundColor: '#282a37',
  borderColor: '#8E8E8E',
  selectionColor: '#C3C3C3',

  shadowColor: '#D3D3D3',
  shadowDarkColor: '#595959',
  shadowLightColor: '#B5D9E3',

  dropShadowDarkColor: '#777777',
  dropShadowLightColor: '#999999',
  dropShadowTransparentColor: 'black',

  warningColor: '#E1B412',
  focusColor: '#FF008E',
  errorColor: '#BA141A',

  textSelectionColor: 'white',
  textSelectionBackground: '#FF008E',

  ...sharedTheme
};

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${props => props.theme.backgroundColor};
    transition: background ${props => props.theme.animationFast} ease-out;
  }

  @media (max-width: ${props => props.theme.mobile}) {
    body {
      margin-top: ${unit * 2.5}px;
    }
  }

  h1 {
    text-transform: lowercase;
    font-size: ${props => props.theme.headingFontSizeLarge};
    font-family: ${props => props.theme.headingFont};
    font-weight: ${props => props.theme.headingFontWeight};
    padding-top: 0;
    margin-bottom: ${props => props.theme.margin};
    margin-top: ${props => props.theme.margin};
  }

  main {
    position: relative;
    max-width: ${props => props.theme.column};
    margin: auto;
    font-family: ${props => props.theme.normalFont};
    font-weight: ${props => props.theme.normalFontWeight};
    font-size: ${props => props.theme.normalFontSize};
    color: ${props => props.theme.foregroundColor};

    &:before {
        content: '{';
        font-family: ${props => props.theme.backgroundFont};
        font-size: 45pt;
        color: ${props => props.theme.borderColor};
    
        float: left;
        position: relative;
        left: -${props => props.theme.spacingOneAndHalf};
        top: 26pt;
        width: 0;
    }

    &:after {
        content: '}';
        font-family: ${props => props.theme.backgroundFont};
        font-size: 45pt;
        color: ${props => props.theme.borderColor};
    
        position: relative;
        top: -1.1em;
        left: calc(100% + ${props => props.theme.spacingHalf});
        text-align: right;
        margin-bottom: -2em;
    }

    @media(max-width: ${props => props.theme.desktop}) {
      &:before, &:after {
        content: '';
      }
    }
  }

  main p {
    color: ${props => props.theme.foregroundColor};
    line-height: ${props => props.theme.normalFontLineHeight};
    margin-left: ${props => props.theme.spacingHalf};
  }

  main a {
    position: relative;
    color: ${props => props.isDark ? props.theme.primaryColor : props.theme.primaryDarkColor};
    text-decoration: none;
    transition: color ${props => props.theme.animationFast} ease-out;
  
    &:hover {
      color: ${props => props.isDark ? props.theme.primaryLightColor : props.theme.primaryDarkColor};
      text-decoration: underline;
    }
  }

  ::selection {
    color: ${props => props.theme.backgroundColor};
    background: ${props => props.theme.focusColor};
  }

  .fill-background {
    fill: ${props => props.theme.accentShadowColor};
  }

  .fill-foreground {
    fill: ${props => props.theme.foregroundColor};
  }

  .fill-none {
    fill: none;
  }

  .stroke-foreground {
    stroke: ${props => props.theme.foregroundColor};
  }

  .stroke-background {
    stroke: ${props => props.theme.accentShadowColor};
  }

  .stroke-border {
    stroke: ${props => props.theme.borderColor};
  }

  .fill-border {
    fill: ${props => props.isDark
      ? props.theme.borderColor
      : props.theme.accentShadowColor
    };
  }

  .fill-opaque {
    fill: ${props => props.theme.backgroundColor};
  } 

  .stroke-focus {
    stroke: ${props => props.theme.focusColor};
  }

  .stroke-none {
    stroke: none;
  }
`;
