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
import Filter from './Filter';
import {
  CompanySection,
  DetailsSection,
  Heading,
  HeroSection,
  KeywordsSection,
  MoreSection,
  StorySection,
  SummarySection,
} from './Story.styles';
export { Sidebar, Location, Dates } from './Story.styles';
import {
  getMarkdown,
  cleanKeyword,
  notDuplicate,
  notIgnoreWord,
} from './storyUtils';
import Paragraph from '../Paragraph/Paragraph';

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

/**
 * Developer Story
 * @param children - One or more <Experience> items
 * @returns {JSX.Element}
 */
export const Story: FC = ({ children }) => {
  const [filter, setFilter] = useState<string | undefined>();
  const [keywords, setKeywords] = useState<string[]>([]);
  const { showTipFor, hideTip, tipProps, tipRef, tooltipText } = useTooltip({
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

  return (
    <StoryContext.Provider
      value={{
        filter,
        autoCompleteKeywords: keywords,
        indexAutoCompleteKeywords,
        setFilter,
        showTipFor,
        hideTip,
      }}
    >
      <StorySection>
        <Filter />
        {children}
        <Tooltip ref={tipRef} {...tipProps}>
          {tooltipText}
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
 * Experience Company
 * @param children - Markdown text that can include links and formatting
 * @returns {JSX.Element}
 */
export const Company: FC = ({ children }) => {
  const { setCompany } = useContext(ExperienceContext);
  const markdown = useMemo(() => getMarkdown(children), [children]);

  useEffect(() => {
    // Add company to search index
    setCompany?.(markdown?.toLowerCase() ?? '');
  }, [children, setCompany]);

  return (
    <CompanySection>
      <ReactMarkdown linkTarget="_blank">{markdown}</ReactMarkdown>
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
    setSummary?.(summary);
  }, [children, setSummary]);

  return (
    <SummarySection>
      <ReactMarkdown
        linkTarget="_blank"
        components={{
          p: Paragraph,
        }}
      >
        {showDetails ? details ?? '' : summary}
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
    setDetails?.(details);
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
