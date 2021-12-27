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

import { getHeadingSlug, getHeadingUrl } from './components/Heading';
import HeadingQuery from './types/HeadingQuery';

export const slugifyHeadings = (baseUrl: string, headings: HeadingQuery[]) =>
  headings.map((heading) => {
    const slug = getHeadingSlug(false, heading.value);
    return {
      ...heading,
      url: getHeadingUrl(baseUrl, slug),
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
  relativeDate.split(' ').slice(1).join(' ');
};

export const openUrl = (url, params) => {
  const href = new URL(url);
  href.search = new URLSearchParams(params).toString();
  window.open(href.toString());
};
