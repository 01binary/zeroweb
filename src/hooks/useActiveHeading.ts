/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Intersection observer for currently visible heading.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import { useEffect, useState } from 'react';
import HeadingQuery from '../types/HeadingQuery';

const SCROLL_EVENT_DURATION = 1000;

const selectFirstHeading = (minIndex, { intersectionRect }, index, all) =>
  intersectionRect.bottom < all[minIndex].intersectionRect.bottom
    ? index
    : minIndex;

const filterVisible = ({ isIntersecting }: IntersectionObserverEntry) =>
  isIntersecting;

const filterDuplicates = (entry: IntersectionObserverEntry, index, all) => {
  const duplicates = all.filter(
    (another) => another.target.id == entry.target.id
  );
  return entry == duplicates[0];
};

const filterTime = (around: number) => (entry: IntersectionObserverEntry) =>
  Math.abs(around - entry.time) < SCROLL_EVENT_DURATION;

const useActiveHeading = (headings: Array<HeadingQuery>): string => {
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [intersections, setIntersections] = useState<
    IntersectionObserverEntry[]
  >([]);

  useEffect(() => {
    // Setup intersection observer
    const observer = new IntersectionObserver((intersections) => {
      // Accumulate intersections
      setIntersections((prevIntersections) =>
        prevIntersections
          .concat(Array.from(intersections).filter(filterVisible))
          .filter(filterDuplicates)
          .filter(filterTime(intersections[0].time))
      );
    });

    headings.forEach((heading) => {
      const headingEl = document.getElementById(heading.slug);
      if (headingEl) observer.observe(headingEl);
    });

    return () =>
      // Tear down intersection observer
      headings.forEach((heading) => {
        const headingEl = document.getElementById(heading.slug);
        if (headingEl) observer.unobserve(headingEl);
      });
  }, [headings, setIntersections]);

  useEffect(() => {
    // Decide which heading is active
    if (intersections.length) {
      const minIndex = intersections.reduce(selectFirstHeading, 0);
      setActiveHeadingId(intersections[minIndex].target.id);
    }
  }, [intersections, setActiveHeadingId]);

  return activeHeadingId;
};

export default useActiveHeading;
