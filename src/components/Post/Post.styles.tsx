/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Blog post styles.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import styled from 'styled-components';
import Img from 'gatsby-image';
import GaugeIcon from '../../images/gauge.svg';
import ClockIcon from '../../images/clock.svg';
import { Heading } from '../Heading';
import { RULER_OFFSET, RULER_SELECTION_GUTTER } from '../Ruler';
import { DESKTOP, MOBILE, SLIDE_COMMENTS_SIDEBAR, WIDE } from '../../constants';

type MainProps = {
  showCommentsSidebar: boolean;
};

export const Main = styled.main<MainProps>`
  position: relative;
  left: 0;

  @media (min-width: ${SLIDE_COMMENTS_SIDEBAR}) {
    left: ${(props) => (props.showCommentsSidebar ? `calc(0px - 9em)` : '0')};

    &:before {
      opacity: ${(props) => (props.showCommentsSidebar ? 0 : 1)};
      transition: opacity 0.3s ease-out;
    }

    &:after {
      top: 0;
      opacity: ${(props) => (props.showCommentsSidebar ? 0 : 1)};
      transition: opacity 0.3s ease-out;
    }
  }

  @media (min-width: 1630px) {
    left: 0;
  }

  transition: left 0.3s ease-out;
  margin-bottom: 3em;

  text-rendering: optimizeLegibility;

  h1 {
    padding-right: calc(20% + ${(props) => props.theme.spacing});
    margin-left: ${(props) => props.theme.spacingHalf};
    margin-right: ${(props) => props.theme.spacingHalf};
  }

  h2 {
    font-size: ${(props) => props.theme.headingFontSizeMedium};
  }

  h3 {
    font-size: ${(props) => props.theme.headingFontSizeSmall};
  }

  h4 {
    font-size: ${(props) => props.theme.headingFontSizeSmaller};
  }

  h2,
  h3,
  h4 {
    text-transform: lowercase;
    font-family: ${(props) => props.theme.headingFont};
    font-weight: ${(props) => props.theme.headingFontWeight};
    margin-bottom: ${(props) => props.theme.margin};
    margin-top: ${(props) => props.theme.margin};
    clear: left;
  }

  h1,
  h2,
  h3,
  h4 {
    &:after {
      content: '';
      position: absolute;
      left: calc(
        100% + ${(props) => props.theme.spacingHalf} +
          ${(props) => props.theme.border} + ${RULER_OFFSET}px
      );
      top: 0;
      width: calc(${(props) => props.theme.border} * 1.5);
      height: 100%;
      background: ${(props) => props.theme.foregroundColor};
      opacity: 0.4;
      transition: opacity ${(props) => props.theme.animationFast} ease-out;
    }
  }

  h1:after {
    left: calc(
      100% + ${(props) => props.theme.spacing} +
        ${(props) => props.theme.border} + ${RULER_SELECTION_GUTTER}px
    );
  }

  h1:hover,
  h2:hover,
  h3:hover,
  h4:hover {
    &:after {
      opacity: 1;
    }

    a {
      opacity: 1;
    }
  }

  ol {
    position: relative;
    list-style: none;
    counter-reset: listCounter;
    padding-left: ${(props) => props.theme.spacingHalf};

    &:after {
      content: '';
      position: absolute;
      left: calc(
        100% + ${(props) => props.theme.spacingHalf} +
          ${(props) => props.theme.border} + ${RULER_OFFSET}px
      );
      top: 0;
      width: calc(${(props) => props.theme.border} * 1.5);
      height: 100%;
      background: ${(props) => props.theme.foregroundColor};
      opacity: 0.4;
      transition: opacity ${(props) => props.theme.animationFast} ease-out;
    }

    &:hover {
      &:after {
        opacity: 1;
      }
    }
  }

  ol > li {
    margin: 0 0 ${(props) => props.theme.spacingHalf} 0;
    &:before {
      display: inline-block;
      content: counter(listCounter);
      color: ${(props) => props.theme.foregroundColor};
      counter-increment: listCounter;
      line-height: ${(props) => props.theme.spacingOneAndThird};
      background: ${(props) =>
        props.theme.isDark
          ? props.theme.alwaysDarkColor
          : props.theme.accentLightShadowColor};
      width: ${(props) => props.theme.spacingOneAndThird};
      height: ${(props) => props.theme.spacingOneAndThird};
      border-radius: ${(props) => props.theme.spacingOneAndThird};
      margin: 0 ${(props) => props.theme.spacingHalf} 0 0;
      text-align: center;
      transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    }

    &:hover:before,
    &:focus:before {
      color: ${(props) => props.theme.backgroundColor};
      background: ${(props) =>
        props.theme.isDark
          ? props.theme.accentColor
          : props.theme.accentShadowColor};
    }
  }

  @media (max-width: ${DESKTOP}) {
    h1,
    h2,
    h3,
    h4 {
      &:after {
        display: none;
      }
    }

    ul,
    ol {
      &:after {
        display: none;
      }
    }
  }

  @media (max-width: ${MOBILE}) {
    margin-bottom: 1em;

    h1,
    h2,
    h3,
    h4 {
      max-width: initial;
      margin-left: ${(props) => props.theme.spacingHalf};
      margin-right: ${(props) => props.theme.spacingHalf};
      padding-right: 0;
    }
  }
`;

export const HeroImage = styled(Img)`
  overflow: initial !important;
  max-width: calc(80% - 3em);
  margin-right: 1.5em;
  margin-left: ${(props) => props.theme.spacingHalf};
  z-index: -1;

  &:after {
    content: '';
    position: absolute;
    left: calc(
      100% + ${(props) => props.theme.spacingHalf} + ${RULER_OFFSET}px + 7px
    );
    top: 0;
    width: calc(${(props) => props.theme.border} * 1.5);
    height: 100%;
    background: ${(props) => props.theme.foregroundColor};
    opacity: 0.4;
    transition: opacity ${(props) => props.theme.animationFast} ease-out;
  }

  opacity: 0;
  animation: slideIn ${(props) => props.theme.animationSlow} 0.2s ease-out 1;
  animation-fill-mode: forwards;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media (max-width: ${DESKTOP}) {
    &:after {
      display: none;
    }
  }

  @media (max-width: ${MOBILE}) {
    max-width: 100%;
    margin-top: 1em;
    margin-right: ${(props) => props.theme.spacingHalf};
  }
`;

export const Metadata = styled.section`
  display: flex;

  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  color: ${(props) => props.theme.secondaryTextColor};
  max-width: calc(80% - 3em);
  margin-left: 1em;
  margin-bottom: 1.5em;

  opacity: 0;
  animation: slideIn ${(props) => props.theme.animationSlow} 0.1s ease-out 1;
  animation-fill-mode: forwards;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media (max-width: ${MOBILE}) {
    max-width: 100%;
    margin-bottom: 0;
  }
`;

export const Content = styled.section`
  max-width: calc(80% - 2em);
  overflow-x: visible;

  @media (max-width: ${MOBILE}) {
    max-width: 100%;
  }

  opacity: 0;
  animation: slideIn ${(props) => props.theme.animationSlow} 0.2s ease-out 1;
  animation-fill-mode: forwards;

  ul {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: calc(
        100% + ${(props) => props.theme.spacingHalf} +
          ${(props) => props.theme.border} + ${RULER_OFFSET}px
      );
      top: 0;
      width: calc(${(props) => props.theme.border} * 1.5);
      height: 100%;
      background: ${(props) => props.theme.foregroundColor};
      opacity: 0.4;
      transition: opacity ${(props) => props.theme.animationFast} ease-out;
    }

    &:hover {
      &:after {
        opacity: 1;
      }
    }

    li {
      margin: 0.5em 0;
    }
  }

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

export const SidebarPanel = styled.section`
  display: block;

  @media (max-width: ${MOBILE}) {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0;
  }

  @media (max-width: 380px) {
    flex-direction: row;
  }
`;

export const Sidebar = styled.aside<{ sendToBack: boolean }>`
  position: sticky;
  float: right;
  top: 0;
  left: 100%;
  min-width: 20%;
  max-width: 20%;
  margin-top: -5.25em;
  padding-top: ${(props) => props.theme.spacingThird};
  z-index: 1;

  @media (max-width: ${SLIDE_COMMENTS_SIDEBAR}) {
    z-index: ${(props) => (props.sendToBack ? 'initial' : 1)};
  }

  @media (max-width: ${MOBILE}) {
    position: relative;
    float: none;
    left: 0;
    max-width: 100%;
    padding-top: 0;
    margin-top: 1em;
    margin-left: ${(props) => props.theme.spacingHalf};
    margin-right: ${(props) => props.theme.spacingHalf};
  }
`;

export const SidebarMetadata = styled.div`
  position: relative;
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  color: ${(props) => props.theme.secondaryTextColor};
  margin-bottom: ${(props) => props.theme.spacing};

  opacity: 0;
  animation: slideIn ${(props) => props.theme.animationSlow} 0.1s ease-out 1;
  animation-fill-mode: forwards;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media (max-width: ${MOBILE}) {
    flex: 0 1 auto;
    margin-left: 1em;
  }

  @media (max-width: 380px) {
    display: none;
  }
`;

export const Gauge = styled(GaugeIcon)`
  float: left;
  margin: 0.25em 0.25em 0 0.5em;

  #arrow {
    transform: rotate(${(props) => props.position * 90}deg);
    transform-origin: 45.634px 47.543px;
    transition: transform ${(props) => props.theme.animationFast} ease-in-out;
  }

  @media (max-width: ${MOBILE}) {
    display: none;
  }
`;

export const Indicator = styled.span`
  font-size: 20pt;
  color: ${(props) => props.theme.foregroundColor};

  @media (max-width: ${MOBILE}) {
    font-size: ${(props) => props.theme.smallFontSize};
  }
`;

export const InlineIndicator = styled.span`
  color: ${(props) => props.theme.foregroundColor};
`;

export const IndicatorLabel = styled.div`
  @media (max-width: ${MOBILE}) {
    display: inline;
  }
`;

export const Clock = styled(ClockIcon)`
  margin-top: -1px;
  margin-right: ${(props) => props.theme.spacingQuarter};
`;

export const PostHeading = styled(Heading)`
  animation: slideIn ${(props) => props.theme.animationSlow} ease-out 1;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

export const Location = styled.span`
  @media (max-width: 540px) {
    display: none;
  }
`;

export const Author = styled.span`
  @media (max-width: 380px) {
    display: none;
  }
`;

export const InlineTimeToRead = styled.span`
  display: none;
  @media (max-width: 380px) {
    display: block;
  }
`;
