import React, { FC, useContext, useState, useCallback } from 'react';
import ExperienceContext from './ExperienceContext';
import { ExperienceCard, ExperienceTimeline } from './Story.styles';
import StoryContext from './StoryContext';

type ExperienceState = {
  title: string;
  company: string;
  summary: string;
  details: string;
  stack: string[];
  keywords: string[];
};

const trimPattern = (pattern: string) =>
  pattern.replace(/^\,\.\w/g, '').replace(/\,\.\w$/g, '');

const notEmptyPattern = (pattern: string) => pattern.length > 0;

const filterMatch = (
  { title, summary, details, stack, keywords }: Partial<ExperienceState>,
  filter: string
) =>
  filter
    .split(' ')
    .filter(notEmptyPattern)
    .map(trimPattern)
    .reduce((matches, token) => {
      const matchesTitle = title?.indexOf(token) >= 0;
      const matchesSummary = summary?.indexOf(token) >= 0;
      const matchesDetails = details?.indexOf(token) >= 0;
      const matchesStack =
        stack?.filter((key) => key.indexOf(token) >= 0)?.length > 0;
      const matchesKeywords =
        keywords?.filter((key) => key.indexOf(token) >= 0)?.length > 0;

      return (
        matches ||
        matchesTitle ||
        matchesSummary ||
        matchesDetails ||
        matchesStack ||
        matchesKeywords
      );
    }, false);

const Experience: FC = ({ children }) => {
  const { filter } = useContext(StoryContext);
  const [experience, setExperience] = useState<Partial<ExperienceState>>({});
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const toggleDetails = useCallback(() => setShowDetails((show) => !show), [
    setShowDetails,
  ]);

  const setTitle = useCallback(
    (title: string) => setExperience((xp) => ({ ...xp, title })),
    [setExperience]
  );

  const setCompany = useCallback(
    (company: string) => setExperience((xp) => ({ ...xp, company })),
    [setExperience]
  );

  const setSummary = useCallback(
    (summary: string) => setExperience((xp) => ({ ...xp, summary })),
    [setExperience]
  );

  const setDetails = useCallback(
    (details: string) => setExperience((xp) => ({ ...xp, details })),
    [setExperience]
  );

  const setStack = useCallback(
    (stack: string[]) => setExperience((xp) => ({ ...xp, stack })),
    [setExperience]
  );

  const setKeywords = useCallback(
    (keywords: string[]) =>
      setExperience((experience) => ({ ...experience, keywords })),
    [setExperience]
  );

  const isMatch = !filter || filterMatch(experience, filter);

  return isMatch ? (
    <ExperienceCard>
      <ExperienceTimeline />
      <ExperienceContext.Provider
        value={{
          setTitle,
          setCompany,
          setSummary,
          setDetails,
          setStack,
          setKeywords,
          toggleDetails,
          showDetails,
          details: experience.details,
        }}
      >
        {children}
      </ExperienceContext.Provider>
    </ExperienceCard>
  ) : null;
};

export default Experience;
