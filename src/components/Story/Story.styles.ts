import styled from 'styled-components';
import { MOBILE, MOBILE_NARROW, MOBILE_WIDE } from '../../constants';
import FilterIcon from '../../images/filter.svg';
import Dot from '../../images/url/cv-dot.svg';
import Button from '../Button';

const STORY_ICON_SIZE = '48px';

export const ContactSection = styled.section`
  display: none;

  @media (max-width: ${MOBILE_NARROW}) {
    display: block;
    margin-top: ${(props) => props.theme.spacingHalf};
    margin-left: ${(props) => props.theme.spacingHalf};
    margin-right: ${(props) => props.theme.spacingHalf};
  }
`;

export const FilterSection = styled.section`
  position: relative;
  display: grid;
  grid-template-columns:
    ${STORY_ICON_SIZE} ${(props) => props.theme.spacing} 1fr max-content ${(
      props
    ) => props.theme.spacingQuarter} max-content ${(props) =>
      props.theme.spacingQuarter} max-content
    ${(props) => props.theme.spacingDouble};

  margin-bottom: ${(props) => props.theme.spacingOneAndHalf};

  @media (max-width: ${MOBILE}) {
    grid-template-columns: ${(props) => props.theme.spacingHalf} 0px 1fr max-content ${(
        props
      ) => props.theme.spacingQuarter} max-content 0 max-content ${(props) =>
        props.theme.spacingDouble};
  }

  @media (max-width: ${MOBILE_WIDE}) {
    grid-template-columns: ${(props) => props.theme.spacingHalf} 0px 1fr max-content ${(
        props
      ) => props.theme.spacingQuarter} max-content 0 max-content ${(props) =>
        props.theme.spacingHalf};
  }

  @media (max-width: ${MOBILE_NARROW}) {
    grid-template-columns: 0px ${(props) => props.theme.spacingHalf} 1fr max-content ${(
        props
      ) => props.theme.border} max-content 0 max-content 0;
  }
`;

export const FilterInput = styled.input`
  grid-row: 1;
  grid-column: 3 / 5;

  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  padding: ${(props) => props.theme.spacingQuarter};
  padding-left: ${(props) => props.theme.spacingOneAndHalf};
  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.foregroundColor};
  border: ${(props) => props.theme.border} solid
    ${(props) => props.theme.borderColor};

  &:focus {
    outline-color: ${(props) => props.theme.focusColor};
    outline-style: solid;
    outline-width: medium;
    border-radius: 1px;
  }
`;

export const FilterIndicator = styled(FilterIcon)`
  position: absolute;
  left: calc(${(props) => props.theme.spacing} * 3);

  @media (max-width: ${MOBILE}) {
    left: ${(props) => props.theme.spacing};
  }
`;

export const FilterButton = styled.button`
  grid-row: 1;
  grid-column: 6;
  align-self: center;

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  width: ${STORY_ICON_SIZE};
  height: ${STORY_ICON_SIZE};

  svg {
    pointer-events: none;
  }

  &:hover {
    .stroke-foreground {
      stroke: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }

    .fill-foreground {
      fill: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }
  }
`;

export const InlineContactButton = styled(Button)`
  grid-row: 1;
  grid-column: 8;

  @media (max-width: ${MOBILE_NARROW}) {
    display: none;
  }
`;

export const StorySection = styled.section`
  position: relative;
  margin-top: ${(props) => props.theme.spacingOneAndHalf};

  .experience__card:last-of-type {
    .experience__timeline {
      display: none;
    }
  }
`;

export const ExperienceCard = styled.article.attrs(() => ({
  className: 'experience__card',
}))`
  display: grid;
  grid-template-columns: 48px 30px 2fr max-content 60px;
  grid-template-rows: repeat(auto-fit, auto);
  grid-auto-flow: dense;

  p {
    margin-bottom: 0;
  }

  p:last-of-type {
    margin-bottom: ${(props) => props.theme.spacingHalf};
  }

  svg {
    grid-column: 1;
    grid-row: 1 / 3;
    align-self: center;
  }

  code {
    font-family: ${(props) => props.theme.normalFont};
    font-size: ${(props) => props.theme.normalFontSize};
    font-weight: ${(props) => props.theme.normalFontWeight};
    color: ${(props) => props.theme.secondaryTextColor};
  }

  @media (max-width: ${MOBILE}) {
    margin-left: ${(props) => props.theme.spacingHalf};
    margin-right: ${(props) => props.theme.spacingHalf};
  }

  @media (max-width: ${MOBILE_WIDE}) {
    grid-template-columns: ${STORY_ICON_SIZE} 24px 1fr;
  }
`;

export const ExperienceTimeline = styled.div.attrs(() => ({
  className: 'experience__timeline',
}))`
  grid-column: 1;
  grid-row: 3 / 5;
  justify-self: center;

  position: relative;
  bottom: 4px;
  width: 6.5px;

  background: url(${Dot});
  background-repeat: round;

  @media (max-width: ${MOBILE_WIDE}) {
    grid-row: 3 / 7;
  }
`;

export const Heading = styled.h2`
  grid-column: 3;
  grid-row: ${(props) => (props.single ? `1 / 3` : `1`)};
  align-self: center;

  font-size: 24px;
  text-transform: initial;
  margin: ${(props) => (props.single ? `1em 0` : `0`)};
`;

export const CompanySection = styled.section`
  grid-column: 3;
  grid-row: 2;

  p {
    margin: 0;
  }

  @media (max-width: ${MOBILE}) {
    margin-top: ${(props) => props.theme.spacingQuarter};
  }
`;

export const Dates = styled.section`
  grid-column: 4;
  grid-row: 1;
  text-align: right;

  @media (max-width: ${MOBILE_WIDE}) {
    grid-column: 3;
    grid-row: 3;
    text-align: initial;
    margin-top: ${(props) => props.theme.spacingQuarter};
  }
`;

export const Location = styled.section`
  grid-column: 4;
  grid-row: 2;

  color: ${(props) => props.theme.secondaryTextColor};
  font-style: italic;
  text-align: right;

  @media (max-width: ${MOBILE_WIDE}) {
    grid-column: 3;
    grid-row: 4;
    text-align: initial;
    margin-top: ${(props) => props.theme.spacingQuarter};
  }
`;

export const StackSection = styled.section`
  grid-column: 4;
  grid-row: auto;
  justify-self: end;
  margin-bottom: ${(props) => props.theme.spacing};

  @media (max-width: ${MOBILE_WIDE}) {
    grid-column: 3;
    grid-row: 5;
    justify-self: start;
    margin-top: ${(props) => props.theme.spacingQuarter};
    margin-bottom: ${(props) => props.theme.spacingHalf};
  }
`;

export const SummarySection = styled.section`
  grid-column: 3;
  grid-row: auto;

  p:first-of-type {
    margin-top: 0;
  }

  @media (max-width: ${MOBILE_WIDE}) {
    grid-row: 6;

    p {
      margin-left: 0;
      margin-right: 0;
    }
  }
`;

export const DetailsSection = styled(SummarySection)`
  display: none;
`;

export const MoreSection = styled.section`
  grid-column: 3;
  grid-row: auto;
  margin-left: ${(props) => props.theme.spacingQuarter};
  margin-bottom: ${(props) => props.theme.spacingHalf};

  @media (max-width: ${MOBILE_WIDE}) {
    margin-left: calc(0px - ${(props) => props.theme.spacingQuarter});
  }
`;

export const Sidebar = styled.aside`
  float: right;
  width: calc(20% + 2em);
  margin-left: 2em;

  @media (max-width: ${MOBILE}) {
    position: initial;
    float: initial;
    width: initial;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: fit-content;
    margin-left: ${(props) => props.theme.spacingHalf};
  }
`;

export const HeroSection = styled.section<{ tight?: boolean }>`
  font-family: 'Roboto', sans-serif;
  font-size: 18pt;
  font-weight: 400;

  margin-block-start: 0;
  ${(props) =>
    props.tight && `margin-bottom: ${props.theme.spacingQuarter} !important`};
  margin-left: calc(${(props) => props.theme.spacing} * 5);

  code {
    font-family: ${(props) => props.theme.normalFont};
    font-size: 18pt;
    font-weight: ${(props) => props.theme.normalFontWeight};
    color: ${(props) => props.theme.secondaryTextColor};
  }

  @media (max-width: ${MOBILE}) {
    max-width: 100%;
    margin-left: ${(props) => props.theme.spacingHalf};
  }
`;
