import React, { FunctionComponent } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

const unit = 24;

const spacing = {
    border: '1px',

    spacingSingle: `${unit}px`,                // 24px
    spacingDouble: `${unit * 2}px`,            // 48px
    spacingTriple: `${unit * 3}px`,            // 72px
    spacingOneAndHalf: `${unit * 1.5}px`,      // 36px
    spacingOneAndThird: `${unit * 4 / 3}px`,   // 32px
    spacingFourThirds: `${unit / 4 / 3}px`,    // 18px
    spacingThreeHalves: `${unit / 3 / 2}px`,   // 16px
    spacingHalf: `${unit / 2}px`,              // 12px
    spacingThird: `${unit / 3}px`,             // 8px
    spacingQuarter: `${unit / 4}px`,           // 6px
    spacingSmall: `${unit / 6}px`,             // 4px
    spacingMin: `${unit / 12}px`,              // 2px

    cornerSmall: `${unit / 3}px`,              // 8px

    breakpointDesktop: '650px',
    breakpointMobile: '320px'
}

const typography = {
    titleFont: 'Consolas, Menlo, monospace',
    titleFontSize: '12pt',
    titleFontWeight: 'normal',

    headingFont: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
    headingFontWeight: 600,
    headingFontSizeLarge: '13.5pt',
    headingFontSizeMedium: '13pt',
    headingFontSizeSmall: '12pt',
    headingFontSizeSmaller: '11.5pt',

    normalFont: '"Open Sans", Arial, sans-serif',
    normalFontWeight: 400,
    normalFontSize: '12pt',
    navigationFontSize: '10pt',

    smallFont: '"Segoe UI", Verdana, sans-serif',
    smallFontWeight: 400,
    smallFontSize: '10pt',
    smallFontLineHeight: '17pt',

    smallestFontSize: '8pt',

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
    focusColor: '#FF5AC0',
    errorColor: '#BA141A',

    textSelectionColor: 'white',
    textSelectionBackground: '#FF5AC0',

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
  main {
    float: left;
    position: relative;
    width: calc(100% - 22px);
    margin-left: 22px;
    font-family: $normal-font;
    font-weight: $normal-font-weight;
    font-size: $normal-font-size;

    &:before {
        content: '{';
        font-family: $background-font;
        font-size: 45pt;
        color: $border-color;
    
        float: left;
        position: relative;
        left: -29px;
        top: 26pt;
        width: 0;
    }

    &:after {
        content: '}';
        font-family: $background-font;
        font-size: 45pt;
        color: $border-color;
    
        position: relative;
        top: -1.1em;
        left: calc(100% + .25em);
        text-align: right;
        margin-bottom: -2em;
    }
  }

  h1 {
    text-transform: lowercase;
    font-size: $heading-font-size-large;
    font-family: $heading-font;
    font-weight: $heading-font-weight;
    padding-top: 0;
    margin-bottom: $margin;
    margin-top: $margin;
  }
`