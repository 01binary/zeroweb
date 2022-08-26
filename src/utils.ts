/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Formatting and data processing utilities.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getHeadingSlug, getHeadingUrl } from './components/Heading';
import HeadingQuery from './types/HeadingQuery';

dayjs.extend(relativeTime);

export const getCommentId = (timestamp: string) =>
  `c${new Date(timestamp).valueOf()}`;

export const formatCommentDate = (timestamp: string): string =>
  dayjs(timestamp).fromNow();

export const formatMarkerDate = (timestamp: string): string =>
  dayjs(timestamp).format('MMM YYYY');

export const formatAbsDate = (timestamp: string): string =>
  dayjs(timestamp).format('MMM DD, YYYY');

export const slugifyHeadings = (baseUrl: string, headings: HeadingQuery[]) =>
  headings.map((heading) => {
    const slug = getHeadingSlug(false, heading.value) ?? '';
    return {
      ...heading,
      url: getHeadingUrl(baseUrl, slug) ?? '',
      slug,
    };
  });

export const getDateValue = (relativeDate: string): string => {
  const value = relativeDate.split(' ')[0];
  if (isNaN(Number(value))) return '';
  return value;
};

export const getDateUnits = (relativeDate: string): string => {
  const value = relativeDate.split(' ')[0];
  if (isNaN(Number(value))) return relativeDate;
  return relativeDate.split(' ').slice(1).join(' ');
};

export const openUrl = (url, params) => {
  const href = new URL(url);
  href.search = new URLSearchParams(params).toString();
  window.open(href.toString());
};
