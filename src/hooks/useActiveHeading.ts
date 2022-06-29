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

const useActiveHeading = (headings: Array<HeadingQuery>): string => {
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [intersections, setIntersections] = useState<
    IntersectionObserverEntry[]
  >([]);

  useEffect(() => {
    // Setup intersection observer
    const observer = new IntersectionObserver((intersections) => {
      // Accumulate intersections
      setIntersections(intersections.filter((i) => i.isIntersecting));
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
    if (intersections.length)
      setActiveHeadingId(intersections[intersections.length - 1].target.id);
  }, [intersections, setActiveHeadingId]);

  return activeHeadingId;
};

export default useActiveHeading;
