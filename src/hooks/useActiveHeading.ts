import { useEffect, useState } from 'react';
import HeadingQuery from '../models/HeadingQuery';

const useActiveHeading = (
    headings: Array<HeadingQuery>
): string => {
    const [activeHeadingId, setActiveHeadingId] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveHeadingId(entry.target.id);
                });
            }
        );

        headings.forEach(heading =>
            observer.observe(document.getElementById(heading.slug)));

        return () => headings.forEach(heading =>
            observer.unobserve(document.getElementById(heading.slug)));

    }, [headings]);

    return activeHeadingId;
};

export default useActiveHeading;
