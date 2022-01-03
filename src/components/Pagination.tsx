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
import { GatsbyLinkProps, Link } from 'gatsby';
import styled, { useTheme } from 'styled-components';
import { getPathForCollection } from '../routes';

const MAX_SLOTS = 8;
const RESERVED_1BREAK = 2;
const RESERVED_2BREAK = 4;
const BREAK = '-';

const getPages = (numberOfPages: number, humanPageNumber: number): string[] => {
  if (!numberOfPages) return [];

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

const Navigation = styled.nav`
  margin-left: ${(props) => props.theme.spacingHalf};
  margin-right: ${(props) => props.theme.spacingHalf};
  margin-bottom: calc(0px - ${(props) => props.theme.spacingDouble});
`;

const Strip = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
`;

const Slot = styled.li`
  flex: 0 0 48px;
`;

const SlotLink = styled(Link)`
  display: flex;

  .focus-outline {
    display: none;
  }

  .background-pushed {
    display: none;
  }

  .top-left {
    stroke: ${(props) => props.theme.backgroundColor};
  }

  .bottom-right {
    stroke: ${(props) => props.theme.accentShadowColor};
  }

  .arrow {
    position: absolute;
    left: 0;
    top: 0;
    fill: ${(props) => props.theme.foregroundColor};
  }

  .label {
    position: absolute;
    left: 5px;
    right: 0;
    top: calc(50% - 0.5em - 3px);
    text-align: center;
    color: ${(props) => props.theme.foregroundColor};
  }

  &:active {
    .background-pushed {
      display: block;
    }

    .top-left {
      stroke: ${(props) => props.theme.accentShadowColor};
    }

    .bottom-right {
      stroke: ${(props) => props.theme.backgroundColor};
    }

    .arrow {
      fill: ${(props) => props.theme.backgroundColor};
    }

    .label {
      color: ${(props) => props.theme.backgroundColor};
    }
  }

  &.current {
    pointer-events: none;

    .background-normal {
      fill: none;
      stroke: ${(props) => props.theme.secondaryColor};
    }

    .top-left,
    .bottom-right {
      display: none;
    }

    .label {
      color: ${(props) => props.theme.secondaryColor};
    }
  }

  &:focus {
    outline: none;
    border-radius: initial;
    box-shadow: initial;

    .focus-outline {
      display: block;
    }
  }
`;

const FirstSlotLink = styled(SlotLink)`
  margin-left: -2px;
`;

const MiddleSlotLink = styled(SlotLink)`
  margin-left: -10px;
`;

type PageLinkProps = {
  to: string;
  label?: string;
  first?: boolean;
  isCurrent?: boolean;
};

const PageLink: FC<PageLinkProps> = ({ to, label, isCurrent }) => {
  const theme = useTheme();
  return (
    <MiddleSlotLink role="button" to={to} className={isCurrent && 'current'}>
      <svg width="56" height="44" viewBox="0 0 56 44">
        <defs>
          <linearGradient id="normal_gradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor={theme.accentHighlightColor} />
            <stop offset="100%" stopColor={theme.accentLightShadowColor} />
          </linearGradient>
          <linearGradient id="pushed_gradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor={theme.accentDarkShadowColor} />
            <stop offset="100%" stopColor={theme.shadowColor} />
          </linearGradient>
        </defs>
        <polygon
          className="focus-outline"
          fill="none"
          stroke={theme.focusColor}
          strokeWidth="2"
          points="2.3,43 1.2,40.4 11.3,30.4 11.3,2.5 12.8,1 53.3,1 54.8,2.5 54.8,31.6 43.4,43 "
        />
        <polygon
          className="background-normal"
          fill="url('#normal_gradient')"
          strokeWidth="1"
          stroke={theme.borderColor}
          points="42.8,41.5 53.2,31 53.2,2.5 12.8,2.5 12.8,31 2.2,41.5 "
        />
        <polygon
          className="background-pushed"
          fill="url('#pushed_gradient')"
          strokeWidth="1"
          stroke={theme.borderColor}
          points="42.8,41.5 53.2,31 53.2,2.5 12.8,2.5 12.8,31 2.2,41.5 "
        />
        <polyline
          className="top-left"
          fill="none"
          points="52.8,3.5 13.7,3.5 13.7,31.4 4.6,40.5 "
        />
        <polyline
          className="bottom-right"
          fill="none"
          points="52.2,4 52.2,30.5 42.5,40.5 3.4,40.5 "
        />
        {!label && (
          <polygon
            className="arrow"
            points="40,21 31.6,12.6 30.6,13.6 37.2,20.3 23.4,20.3 23.4,21.7 37.2,21.7 30.6,28.3 31.6,29.4 "
          />
        )}
      </svg>
      {label && <div className="label">{label}</div>}
    </MiddleSlotLink>
  );
};

const BackLink: FC<{ to: string }> = ({ to }) => {
  const theme = useTheme();
  return (
    <FirstSlotLink role="button" to={to}>
      <svg width="48" height="44" viewBox="0 0 48 44">
        <defs>
          <linearGradient id="normal_gradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor={theme.accentHighlightColor} />
            <stop offset="100%" stopColor={theme.accentLightShadowColor} />
          </linearGradient>
          <linearGradient id="pushed_gradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor={theme.accentDarkShadowColor} />
            <stop offset="100%" stopColor={theme.shadowColor} />
          </linearGradient>
        </defs>
        <polygon
          className="focus-outline"
          fill="none"
          stroke={theme.focusColor}
          strokeWidth="2"
          points="1,41.5 1,12.4 12.4,1 45.5,1 47,2.5 47,31.6 35.6,43 2.5,43 "
        />
        <polygon
          className="background-normal"
          fill="url('#normal_gradient')"
          strokeWidth="1"
          stroke={theme.borderColor}
          points="13,2.5 2.5,13 2.5,41 3,41.5 35,41.5 45.5,31 45.5,2.5 "
        />
        <polygon
          className="background-pushed"
          fill="url('#pushed_gradient')"
          strokeWidth="1"
          stroke={theme.borderColor}
          points="13,2.5 2.5,13 2.5,41 3,41.5 35,41.5 45.5,31 45.5,2.5 "
        />
        <polyline
          className="top-left"
          fill="none"
          points="3.5,40 3.5,13.3 13.3,3.5 45,3.5 "
        />
        <polyline
          className="bottom-right"
          fill="none"
          points="44.5,4 44.5,30.7 34.7,40.5 3,40.5 "
        />
        <polygon
          className="arrow"
          points="15.6,21.5 24,13.1 25,14.1 18.3,20.8 32.2,20.8 32.2,22.2 18.3,22.2 25,28.8 24,29.9 "
        />
      </svg>
    </FirstSlotLink>
  );
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
    <Navigation role="navigation" aria-label="pagination navigation">
      <Strip>
        {humanPageNumber > 1 && (
          <Slot>
            <BackLink to={previousPagePath} />
          </Slot>
        )}
        {getPages(numberOfPages, humanPageNumber).map((page, index) => (
          <Slot key={page}>
            {page === BREAK ? (
              '...'
            ) : (
              <PageLink
                to={getPageUrl(page, collection)}
                aria-label={`Go to page ${page}`}
                label={page}
                isCurrent={index + 1 === humanPageNumber}
              />
            )}
          </Slot>
        ))}
        {humanPageNumber < numberOfPages && (
          <Slot>
            <PageLink to={nextPagePath} />
          </Slot>
        )}
      </Strip>
    </Navigation>
  );
