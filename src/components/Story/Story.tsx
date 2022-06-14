import React, { FC, useState, useContext, useEffect, useMemo } from 'react';
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
import { getMarkdown } from './storyUtils';

export const Story: FC = ({ children }) => {
  const [filter, setFilter] = useState<string | undefined>();
  const { showTipFor, hideTip, tipProps, tipRef, tooltipText } = useTooltip({
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 5,
    placement: 'top',
  });

  return (
    <StoryContext.Provider
      value={{
        filter,
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

export const Title: FC<{ single?: true }> = ({ single, children }) => {
  const { setTitle } = useContext(ExperienceContext);

  useEffect(() => {
    setTitle(children.toString().toLowerCase());
  }, [children, setTitle]);

  return <Heading single={single}>{children}</Heading>;
};

export const Company: FC = ({ children }) => {
  const { setCompany } = useContext(ExperienceContext);
  const markdown = useMemo(() => getMarkdown(children), [children]);

  useEffect(() => {
    setCompany(markdown.toLowerCase());
  }, [children, setCompany]);

  return (
    <CompanySection>
      <ReactMarkdown linkTarget="_blank">{markdown}</ReactMarkdown>
    </CompanySection>
  );
};

export const Summary: FC = ({ children }) => {
  const { setSummary, details, showDetails, toggleDetails } = useContext(
    ExperienceContext
  );

  const summary = useMemo(() => getMarkdown(children), [children]);
  const hasMore = details && details.length;

  useEffect(() => {
    setSummary(summary.toLowerCase());
  }, [children, setSummary]);

  return (
    <SummarySection>
      <ReactMarkdown linkTarget="_blank">
        {showDetails ? details : summary}
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

export const Details: FC = ({ children }) => {
  const { setDetails } = useContext(ExperienceContext);
  const details = useMemo(() => getMarkdown(children), [children]);

  useEffect(() => {
    setDetails(details);
  }, [children, setDetails]);

  return <DetailsSection>{children}</DetailsSection>;
};

export const Keywords: FC = ({ children }) => {
  const { setKeywords } = useContext(ExperienceContext);
  const keywords = useMemo(
    () =>
      children
        .toString()
        .split(',')
        .map((k) => k.trim()),
    [children]
  );

  useEffect(() => {
    setKeywords(keywords);
  }, [keywords, setKeywords]);

  return <KeywordsSection>{children}</KeywordsSection>;
};

export const Hero: FC<{ tight?: boolean }> = ({ tight, children }) => (
  <HeroSection tight={tight}>
    <ReactMarkdown linkTarget="_blank">{getMarkdown(children)}</ReactMarkdown>
  </HeroSection>
);
