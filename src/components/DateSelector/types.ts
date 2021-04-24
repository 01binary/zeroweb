/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Date selector business logic types.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import * as dayjs from 'dayjs';

export type WeekMapping = {
  // Month name
  month: string;

  // Month week index
  week: number;
};

export interface ContributionPage {
  // First week summary to display on this page
  start: WeekMapping;

  // Last week summary to display on this page
  end: WeekMapping;
};

export interface MonthSummary {
  // Accumulated tag counts for the month
  tags: Record<string, number>;

  // Week summaries by first day of week
  weeks: Record<string, WeekSummary>;

  // Total posts published in this month
  posts: number;

  // Max posts published in any week
  max: number;
};

export interface WeekSummary {
  // Count of tags aggregated for this week
  tags: Record<string, number>;

  // Week day summaries
  days: Record<string, DaySummary>;

  // Post slugs mapped to titles
  posts: Record<string, string>;

  // Display offset of this week within the month.
  offset: number;

  // Max tags for any week day
  max: number;

  // Total tag count for the week
  total: number;
};

interface DaySummary {
  // Number of posts on this day
  count: number;

  // Tags posted on this day
  tags: string[];
};

export interface ContributionSummary {
  // Monthly contributions
  months: Record<string, MonthSummary>;

  // Years contributions are available for
  years: number[];

  // Year the contribution summary is currently filtered by
  year: number;

  // Max post count for any month
  max: number;
};

export interface PagedContributionSummary extends ContributionSummary {
  // Months to display on each page
  pages: ContributionPage[];
};

export interface DateSelectorQuery {
  allMdx: DateSelectorPostsQuery;
};

export interface DateSelectorPostsQuery {
  nodes: DateSelectorPostQuery[];
};

export interface DateSelectorPostQuery {
  slug: string,
  frontmatter: DateSelectorPostMetadataQuery;
  fields: DateSelectorPostFieldsQuery;
};

export interface DateSelectorPostMetadataQuery {
  title: string;
  date: string;
};

export interface DateSelectorPostFieldsQuery {
  tags: string[];
  collection: string;
};

export interface DateSelectorProps {
  collection: string;
  numberOfPages: number;
  pageNumber: number;
  humanPageNumber: number;
  previousPagePath: string;
  nextPagePath: string;
  year?: number;
  limit?: number;
};

export interface TagQuery {
  slug: string;
  title: string;
  date: dayjs.Dayjs;
  tag: string;
};
