import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import { ExperienceBar, ExperienceBarSection } from './Story.styles';
import SummaryBorder from '../../images/summary-border.svg';
import { STACK_ICONS } from './storyUtils';
import StoryContext from './StoryContext';
import Duration from './Duration';
import { MOBILE } from '../../constants';

const TOP_SKILLS = 5;

const SkillSummarySection = styled.section`
  margin-left: calc(
    ${(props) => props.theme.spacingDouble} +
      ${(props) => props.theme.spacingHalf}
  );
  margin-right: calc(
    ${(props) => props.theme.spacing} * 9 -
      ${(props) => props.theme.borderThick}
  );

  margin-bottom: ${(props) => props.theme.spacing};

  @media (max-width: ${MOBILE}) {
    margin-left: ${(props) => props.theme.spacingHalf};
    margin-right: ${(props) => props.theme.spacingDouble};
  }
`;

const SkillSummaryItem = styled.div`
  display: grid;
  grid-template-columns: 48px ${(props) => props.theme.spacingHalf} 1fr 1fr;
`;

const SkillIconCell = styled.div`
  grid-column: 1;
  width: 16px;
  height: 16px;
  position: relative;
  top: -10px;
`;

const SkillTitleCell = styled.div`
  grid-column: 3;
`;

const SkillIndicatorCell = styled.div`
  grid-column: 4;
`;

const SkillBorder = styled(SummaryBorder)`
  position: relative;
  top: calc(
    0px - ${(props) => props.theme.spacingQuarter} -
      ${(props) => props.theme.borderThick}
  );
`;

const SkillSummary: FC = () => {
  const { keywordRanges: skills, totalExperience: time } = useContext(
    StoryContext
  );

  const topSkills = Object.keys(skills)
    .map((keyword) => ({
      keyword,
      duration: skills[keyword].max.valueOf() - skills[keyword].min.valueOf(),
    }))
    .sort(({ duration: firstDuration }, { duration: secondDuration }) => {
      if (firstDuration > secondDuration) return -1;
      else if (secondDuration > firstDuration) return 1;
      else return 0;
    })
    .slice(0, TOP_SKILLS)
    .map(({ keyword }) => keyword);

  return (
    <SkillSummarySection>
      {topSkills.map((skill) => {
        const SkillIcon = STACK_ICONS[skill];
        const { min, max } = skills[skill];
        const mastery = ((max.valueOf() - min.valueOf()) / time) * 100;

        return (
          <SkillSummaryItem>
            <SkillIconCell>
              <SkillIcon width="32" height="32" />
            </SkillIconCell>
            <SkillTitleCell>
              {skill}
              <SkillBorder />
            </SkillTitleCell>
            <SkillIndicatorCell>
              <ExperienceBarSection>
                <ExperienceBar percent={mastery} />
              </ExperienceBarSection>
              <Duration
                startDate={skills[skill].min}
                endDate={skills[skill].max}
                align="start"
                noIcon
              />
            </SkillIndicatorCell>
          </SkillSummaryItem>
        );
      })}
    </SkillSummarySection>
  );
};

export default SkillSummary;
