import React, { FC, useContext, useState, useCallback } from 'react';
import ExperienceContext from './ExperienceContext';
import {
  ExperienceCard,
  ExperienceRuler,
  ExperienceRulerMark,
  ExperienceRulerSubMark,
  ExperienceTimeline,
} from './Story.styles';
import StoryContext from './StoryContext';
import { PARAGRAPH_SEPARATOR } from './storyUtils';

type ExperienceState = {
  title: string;
  company: string;
  summary: string;
  summaryIndex: string;
  details: string;
  detailsIndex: string;
  stack: string[];
  keywords: string[];
};

const trimPattern = (pattern: string) =>
  pattern.replace(/^\,\.\w/g, '').replace(/\,\.\w$/g, '');

const notEmptyPattern = (pattern: string) => pattern.length > 0;

const filterMatch = (
  {
    title,
    summaryIndex,
    detailsIndex,
    stack,
    keywords,
  }: Partial<ExperienceState>,
  filter: string
) =>
  filter
    .split(' ')
    .filter(notEmptyPattern)
    .map(trimPattern)
    .reduce((matches, token) => {
      const matchesTitle = title?.indexOf(token) >= 0;
      const matchesSummary = summaryIndex?.indexOf(token) >= 0;
      const matchesDetails = detailsIndex?.indexOf(token) >= 0;
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

const getMarkCount = (text: string) => {
  if (!text) return 0;

  const paragraphs = text.split(PARAGRAPH_SEPARATOR);

  if (paragraphs.length > 1) {
    const filtered = paragraphs.filter((p) => p.length > 120);
    return Math.max(filtered.length, 1);
  }

  return paragraphs.length;
};

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
    (summary: string) =>
      setExperience((xp) => ({
        ...xp,
        summary,
        summaryIndex: summary.toLowerCase().replace('`', ''),
      })),
    [setExperience]
  );

  const setDetails = useCallback(
    (details: string) =>
      setExperience((xp) => ({
        ...xp,
        details,
        detailsIndex: details.toLowerCase().replace('`', ''),
      })),
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

  const isMatch =
    !filter || filterMatch(experience, filter.toLocaleLowerCase());
  const summaryMarks = getMarkCount(experience.summary);
  const detailsMarks = getMarkCount(experience.details);
  const markCount = showDetails ? detailsMarks : summaryMarks;
  const marks = Array.from(Array(markCount).keys());

  return isMatch ? (
    <ExperienceCard>
      <ExperienceTimeline />
      <ExperienceRuler>
        {marks.map((mark) => (
          <ExperienceRulerMark key={`mark${mark}`}>
            <ExperienceRulerSubMark />
            <ExperienceRulerSubMark />
          </ExperienceRulerMark>
        ))}
      </ExperienceRuler>
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
