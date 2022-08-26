/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Scroll position hooks used to update reading gauge.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const THROTTLE_MS = 200;

const isBrowser = typeof window !== `undefined`;

const getScrollPercent: () => number = () => {
  if (!isBrowser) return 0;

  const h = document.documentElement;
  const b = document.body;
  const st = 'scrollTop';
  const sh = 'scrollHeight';

  const pos = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);

  return isNaN(pos) ? 0 : pos;
};

const useScrollPosition = () => {
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [readPosition, setReadPosition] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  const updatePosition = useCallback(() => {
    const currentPosition = getScrollPercent();
    const offset =
      document.documentElement.scrollTop || document.body.scrollTop;

    setReadPosition(currentPosition);
    setScrollOffset(offset);

    throttleTimeoutRef.current = undefined;
  }, []);

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (throttleTimeoutRef.current === undefined)
        throttleTimeoutRef.current = setTimeout(updatePosition, THROTTLE_MS);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [updatePosition]);

  return { readPosition, scrollOffset };
};

export default useScrollPosition;
