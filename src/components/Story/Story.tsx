/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Components that can be used to build an online CV.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, {
  FC,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import ReactMarkdown from 'react-markdown';
import LinkButton from '../LinkButton';
import { Arrow, Tooltip } from '../Tooltip';
import { useTooltip } from '../../hooks/useTooltip';
import StoryContext from './StoryContext';
import ExperienceContext from './ExperienceContext';
import Duration from './Duration';
import Filter from './Filter';
import {
  CompanySection,
  DatesSection,
  DetailsSection,
  ExperienceBar,
  ExperienceBarSection,
  Heading,
  HeroSection,
  KeywordsSection,
  MoreSection,
  StorySection,
  SummarySection,
  TipUnit,
} from './Story.styles';
export { Sidebar, Location, DatesSection } from './Story.styles';
import {
  getMarkdown,
  cleanKeyword,
  notDuplicate,
  notIgnoreWord,
} from './storyUtils';
import Paragraph from '../Paragraph/Paragraph';
import { parseDate } from '../../utils';

type KeywordRange = {
  min: Date;
  max: Date;
};

/**
 * Objective
 * @param tight - Whether to use less bottom spacing
 * @returns {JSX.Element}
 */
export const Hero: FC<{ tight?: boolean }> = ({ tight, children }) => (
  <HeroSection tight={tight}>
    <ReactMarkdown linkTarget="_blank">{getMarkdown(children)}</ReactMarkdown>
  </HeroSection>
);

const accumulateExperience = (
  current: KeywordRange | undefined,
  min: Date,
  max: Date
) => ({
  min: current && current.min.valueOf() < min.valueOf() ? current.min : min,
  max: current && current.max.valueOf() > max.valueOf() ? current.max : max,
});

const getTotalExperience = (ranges: KeywordRange[]) => {
  const { totalMin, totalMax } = ranges.reduce(
    ({ totalMin, totalMax }, { min, max }) => ({
      totalMin:
        totalMin === 0 ? min.valueOf() : Math.min(totalMin, min.valueOf()),
      totalMax:
        totalMax === 0 ? max.valueOf() : Math.max(totalMax, max.valueOf()),
    }),
    {
      totalMin: 0,
      totalMax: 0,
    }
  );

  return totalMax - totalMin;
};

const getExperience = ({ min, max }: KeywordRange, totalExperience: number) => {
  const duration = max.valueOf() - min.valueOf();
  const percent = ((duration / totalExperience) * 100).toFixed(1);

  return {
    min,
    max,
    percent,
  };
};

/**
 * Developer Story
 * @param children - One or more <Experience> items
 * @returns {JSX.Element}
 */
export const Story: FC = ({ children }) => {
  const [filter, setFilter] = useState<string | undefined>();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordRanges, setKeywordRanges] = useState<
    Record<string, KeywordRange>
  >({});

  const { showTipFor, hideTip, tipProps, tooltipText: keyword } = useTooltip({
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 5,
    placement: 'top',
  });

  const indexAutoCompleteKeywords = useCallback(
    (keywords: string[]) => {
      setKeywords((existingKeywords) =>
        existingKeywords
          .concat(keywords.filter(notIgnoreWord))
          .map(cleanKeyword)
          .filter(notDuplicate)
      );
    },
    [setKeywords]
  );

  const accumulateExperiences = useCallback(
    (keywords: string[], min: Date, max: Date) => {
      setKeywordRanges((prev) =>
        keywords.reduce(
          (ranges: Record<string, KeywordRange>, keyword: string) => ({
            ...ranges,
            [keyword]: accumulateExperience(ranges[keyword], min, max),
          }),
          prev
        )
      );
    },
    []
  );

  const totalExperience = useMemo(
    () => getTotalExperience(Object.values(keywordRanges)),
    [keywordRanges]
  );

  const experienceDetails = useMemo(
    () =>
      keyword && keywordRanges[keyword]
        ? getExperience(keywordRanges[keyword], totalExperience)
        : undefined,
    [keyword, keywordRanges, totalExperience]
  );

  return (
    <StoryContext.Provider
      value={{
        filter,
        autoCompleteKeywords: keywords,
        keywordRanges,
        totalExperience,
        accumulateExperiences,
        indexAutoCompleteKeywords,
        setFilter,
        showTipFor,
        hideTip,
      }}
    >
      <StorySection>
        <Filter />
        {children}
        <Tooltip {...tipProps}>
          {keyword}
          {experienceDetails ? (
            <ExperienceBarSection>
              <ExperienceBar percent={experienceDetails?.percent ?? 0} />
            </ExperienceBarSection>
          ) : null}
          {experienceDetails ? (
            <Duration
              startDate={experienceDetails.min}
              endDate={experienceDetails.max}
              unit={TipUnit}
            />
          ) : null}
          <Arrow />
        </Tooltip>
      </StorySection>
    </StoryContext.Provider>
  );
};

/**
 * Developer Story Filter row with input field and clear button
 */
export { default as Filter } from './Filter';

/**
 * Developer Story Contact information
 */
export { default as Contact } from './Contact';

/**
 * Developer Story Social Links
 */
export { default as SocialLinks } from './SocialLinks';

/**
 * Developer Story Experience (also use for education, interests, etc)
 * Maintains a search index for its children to make CV filterable
 */
export { default as Experience } from './Experience';

/**
 * Developer Story Summary
 */
export { default as SkillSummary } from './SkillSummary';

/**
 * Experience Title
 * @param single - This title will not be paired with <Company>
 * @returns {JSX.Element}
 */
export const Title: FC<{ single?: true }> = ({ single, children }) => {
  const { setTitle } = useContext(ExperienceContext);

  useEffect(() => {
    // Add title to search index
    setTitle?.(children?.toString()?.toLowerCase() ?? '');
  }, [children, setTitle]);

  return <Heading single={single}>{children}</Heading>;
};

/**
 * Experience Dates
 * @returns {JSX.Element}
 */
export const Dates: FC = ({ children }) => {
  const { setDates } = useContext(ExperienceContext);
  const dates = children?.toString() ?? '';
  const [startDate, endDate] = useMemo(
    () =>
      dates
        .split('–')
        .map((date) => date.trim())
        .map((date) =>
          date === 'Present' ? new Date() : parseDate(date, 'MMM YYYY')
        ),
    [dates]
  );

  useEffect(() => {
    if (dates.length) setDates(startDate, endDate);
  }, [dates, startDate, endDate]);

  return (
    <DatesSection>
      <div>{children}</div>
      <Duration startDate={startDate} endDate={endDate} />
    </DatesSection>
  );
};

/**
 * Experience Company
 * @param children - Markdown text that can include links and formatting
 * @returns {JSX.Element}
 */
export const Company: FC = ({ children }) => {
  const { setCompany } = useContext(ExperienceContext);
  const markdown = useMemo(() => getMarkdown(children), [children]);

  useEffect(() => {
    // Add company to search index
    if (markdown) setCompany?.(markdown.toLowerCase());
  }, [children, setCompany]);

  return (
    <CompanySection>
      <ReactMarkdown linkTarget="_blank">{markdown ?? ''}</ReactMarkdown>
    </CompanySection>
  );
};

/**
 * Experience Summary
 * @param children - Markdown text that can include links and formatting
 * @returns {JSX.Element}
 */
export const Summary: FC = ({ children }) => {
  const { setSummary, details, showDetails, toggleDetails } = useContext(
    ExperienceContext
  );

  const summary = useMemo(() => getMarkdown(children), [children]);
  const hasMore = details && details.length;

  useEffect(() => {
    // Add summary text to search index
    if (summary) setSummary?.(summary);
  }, [children, setSummary]);

  return (
    <SummarySection>
      <ReactMarkdown
        linkTarget="_blank"
        components={{
          p: Paragraph,
        }}
      >
        {(showDetails ? details : summary) ?? ''}
      </ReactMarkdown>
      {hasMore && (
        <MoreSection>
          <LinkButton onClick={toggleDetails}>
            {showDetails ? 'less' : 'more...'}
          </LinkButton>
        </MoreSection>
      )}
    </SummarySection>
  );
};

/**
 * Experience Details (replaces content of Summary when "more" button is clicked)
 * @param children - Markdown text that can include links and formatting
 * @returns {JSX.Element}
 */
export const Details: FC = ({ children }) => {
  const { setDetails } = useContext(ExperienceContext);
  const details = useMemo(() => getMarkdown(children), [children]);

  useEffect(() => {
    // Add details text to search index
    if (details) setDetails?.(details);
  }, [children, setDetails]);

  return <DetailsSection>{children}</DetailsSection>;
};

/**
 * Experience Technology Stack (displays in a hex list with icons)
 */
export { default as Stack } from './Stack';

/**
 * Experience keywords (hidden, used as hints in search index and for SEO)
 * @param children - Plain text with one or more words separated by commas
 * @returns {JSX.Element}
 */
export const Keywords: FC = ({ children }) => {
  const { setKeywords } = useContext(ExperienceContext);
  const keywords = useMemo(
    () =>
      children
        ? children
            .toString()
            .split(',')
            .map((k) => k.trim())
        : [],
    [children]
  );

  useEffect(() => {
    // Add keywords to search index
    setKeywords?.(keywords);
  }, [keywords, setKeywords]);

  return <KeywordsSection>{children}</KeywordsSection>;
};
