import React, { FunctionComponent } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

const unit = 30;

const spacing = {
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
    desktop: '860px',
    mobile: '320px'
}

const typography = {
    titleFont: 'Consolas, Menlo, monospace',
    titleFontSize: '16pt',
    titleFontWeight: 'normal',

    headingFont: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
    headingFontWeight: 600,
    headingFontSizeLarge: '20pt',
    headingFontSizeMedium: '18pt',
    headingFontSizeSmall: '15pt',
    headingFontSizeSmaller: '14.375pt',

    normalFont: '"Open Sans", Arial, sans-serif',
    normalFontWeight: 400,
    normalFontSize: '15pt',
    navigationFontSize: '12.5pt',

    smallFont: '"Segoe UI", Verdana, sans-serif',
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

const lightTheme = {
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
    borderColor: '#D3D3D3',
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

    ...spacing,
    ...typography,
    ...animations
};

const darkTheme = {
    ...spacing,
    ...typography,
    ...animations
};

interface IThemeProps {
    dark: boolean
}

export const Theme: FunctionComponent<IThemeProps> = (
    { dark, children }
) => (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
        {children}
    </ThemeProvider>
);

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${props => props.theme.backgroundColor}
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
    width: ${props => props.theme.desktop};
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
  }

  main p {
    color: ${props => props.theme.foregroundColor};
    margin-left: ${props => props.theme.spacingHalf};
  }

  main section {
    margin-left: ${props => props.theme.spacingHalf};
  }

  a {
    position: relative;
    color: ${props => props.theme.accentTextColor};
    text-decoration: none;
    transition: color ${props => props.theme.animationFast} ease-out;
  
    &:hover {
      color: ${props => props.theme.accentTextColor};
      text-decoration: underline;
    }
  }

  ::selection {
    color: ${props => props.theme.backgroundColor};
    background: ${props => props.theme.focusColor};
  }

  .fill-background {
    fill: ${props => props.theme.backgroundColor};
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
    stroke: ${props => props.theme.backgroundColor};
  }

  .stroke-border {
    stroke: ${props => props.theme.borderColor};
  }

  .stroke-none {
    stroke: none;
  }
`;
