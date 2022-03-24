/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Component that displays post chart and paging buttons.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useMemo } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import {
  DateSelectorQuery,
  DateSelectorProps,
  PagedContributionSummary
} from './types';
import { getContributions } from './contributions';
import dayjs from 'dayjs';

//const EMPTY = [];
//const WEEKDAYS = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const DateSelector: FC<DateSelectorProps> = ({
  collection: filterCollection,
  numberOfPages,
  pageNumber,
  humanPageNumber,
  previousPagePath,
  nextPagePath,
  year = dayjs().year(),
  limit
}) => {
    const {
      allMdx: {
        nodes
      }
    }: DateSelectorQuery = useStaticQuery(graphql`
    query {
        allMdx
        (
          sort: { fields: [frontmatter___date], order: DESC }
        ) {
          nodes {
            slug
            frontmatter {
              title
              date(formatString: "MM/DD/YYYY")
            }
            fields {
              tags,
              collection
            }
          }
        }
      }
    `);

    const contrib = useMemo<PagedContributionSummary>(
      () => getContributions(
        nodes.filter(
          ({ fields: { collection }}) => collection === filterCollection
        ),
        year,
        limit
    ), [nodes, year, limit]);

    const hasNext = pageNumber < numberOfPages - 1;
    const hasPrev = pageNumber > 0;

    return null;

    /*return (
        <section>
          {hasPrev && <Link to={previousPagePath}>Previous</Link>}
          {hasNext && <Link to={nextPagePath}>Next</Link>}
        </section>
    )*/
};

export default DateSelector;
