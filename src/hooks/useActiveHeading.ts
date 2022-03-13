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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveHeadingId(entry.target.id);
      });
    });

    headings.forEach((heading) => {
      const headingEl = document.getElementById(heading.slug);
      if (headingEl) observer.observe(headingEl);
    });

    return () =>
      headings.forEach((heading) => {
        const headingEl = document.getElementById(heading.slug);
        if (headingEl) observer.unobserve(headingEl);
      });
  }, [headings]);

  return activeHeadingId;
};

export default useActiveHeading;
