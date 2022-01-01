/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Pagination strip with previous/next and page buttons.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import { Link } from 'gatsby';
import { getPathForCollection } from '../routes';

const MAX_SLOTS = 8;
const RESERVED_1BREAK = 2;
const RESERVED_2BREAK = 4;
const BREAK = '-';

const getPages = (numberOfPages: number, humanPageNumber: number): string[] => {
  const slots1Break = Math.min(numberOfPages + RESERVED_1BREAK, MAX_SLOTS);
  const slots2Break = Math.min(numberOfPages + RESERVED_2BREAK, MAX_SLOTS);

  // Calculate visible pages for 1 break view
  const halfVisibleSlots = Math.floor((slots1Break - RESERVED_1BREAK) / 2);
  let pagesBeforeBreak = halfVisibleSlots;

  if (pagesBeforeBreak + halfVisibleSlots + RESERVED_1BREAK < slots1Break)
    pagesBeforeBreak++;

  // Calculate number of page slots in middle break (if 2 break view)
  const pagesMiddleBreak = slots2Break - RESERVED_2BREAK - 1;

  // Calculate the range of current page before middle break is scrolled by one left or right
  const middleBreakGroups = Math.max(1, pagesMiddleBreak - 2);

  // Calculate first page in middle break
  const firstPage =
    Math.floor((humanPageNumber - pagesBeforeBreak) / middleBreakGroups) *
      middleBreakGroups +
    pagesBeforeBreak -
    1;

  if (numberOfPages + 1 <= MAX_SLOTS) {
    // Allocate visible slots
    const pages = new Array(numberOfPages - 1);

    // Display all pages with no breaks
    for (let n = 0; n < numberOfPages; n++) pages[n] = (n + 1).toString();

    return pages;
  } else if (
    humanPageNumber >= pagesBeforeBreak &&
    humanPageNumber < numberOfPages - pagesMiddleBreak
  ) {
    // Allocate visible slots (-1 for next button, -1 for last element instead of count)
    const lastSlot = slots2Break - 2;
    if (lastSlot <= 0) return [];

    const pages = new Array(lastSlot);

    // Calculate page slots for 2-break view
    // <- 1 ... X X X X .. n ->
    pages[0] = '1';
    pages[1] = BREAK;

    if (pagesMiddleBreak === 1) {
      pages[2] = humanPageNumber;
    } else {
      for (let n = 2; n < slots2Break - 3; n++) {
        pages[n] = (n - 2 + firstPage).toString();
      }
    }

    pages[slots2Break - 3] = BREAK;
    pages[slots2Break - 2] = numberOfPages.toString();

    return pages;
  } else if (humanPageNumber >= numberOfPages - halfVisibleSlots - 1) {
    // Allocate visible slots (-1 for next button, -1 for last element instead of count)
    const lastSlot = slots1Break - 2;
    if (lastSlot <= 0) return [];

    const startPage = numberOfPages - lastSlot + 2;

    const pages = new Array(lastSlot);
    pages[0] = '1';
    pages[1] = BREAK;

    // Calculate slots for 1-break end view
    // <- 1 .. n-3 n-2 n-1 n ->
    for (let n = 2; n <= lastSlot; n++) {
      pages[n] = (n - 2 + startPage).toString();
    }

    return pages;
  } else {
    // Allocate visible slots (including breaks but excluding next button)
    const pages = new Array(slots1Break - 2);

    // Calculate slots for 1-break view
    // <- 1 2 3 4 .. n - 2 n-1 n ->
    pages[pagesBeforeBreak] = BREAK;

    for (let n = 0; n < pagesBeforeBreak; n++) {
      pages[n] = (n + 1).toString();

      if (n < halfVisibleSlots)
        pages[n + pagesBeforeBreak + 1] = (
          numberOfPages -
          halfVisibleSlots +
          n +
          1
        ).toString();
    }

    return pages;
  }
};

const getPageUrl = (page: string, collection: string) => {
  const path = getPathForCollection(collection);
  return page === '1' ? `${path}` : `${path == '/' ? '' : path}/${page}`;
};

export type PaginationProps = {
  collection: string;
  numberOfPages: number;
  humanPageNumber: number;
  previousPagePath: string;
  nextPagePath: string;
};

export const Pagination: FC<PaginationProps> = ({
  collection,
  numberOfPages,
  humanPageNumber,
  previousPagePath,
  nextPagePath,
}) =>
  numberOfPages == 1 ? null : (
    <nav role="navigation" aria-label="pagination navigation">
      <ul>
        {humanPageNumber > 1 && (
          <li>
            <Link to={previousPagePath}>Back</Link>
          </li>
        )}
        {getPages(numberOfPages, humanPageNumber).map((page) => (
          <li key={page}>
            {page === BREAK ? (
              '...'
            ) : (
              <Link
                to={getPageUrl(page, collection)}
                aria-label={`Go to page ${page}`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
        {humanPageNumber < numberOfPages && (
          <li>
            <Link to={nextPagePath}>Next</Link>
          </li>
        )}
      </ul>
    </nav>
  );
