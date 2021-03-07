import { useEffect, useState } from 'react';
import IHeading from '../models/IHeading';

const useActiveHeading = (headings: Array<IHeading>) => {
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