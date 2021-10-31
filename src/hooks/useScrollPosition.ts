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

import React, { useLayoutEffect, useRef } from 'react';

const THROTTLE_MS = 200;

const isBrowser = typeof window !== `undefined`

const getScrollPercent: () => number = () => {
  if (!isBrowser) return 0;

  const h = document.documentElement;
  const b = document.body;
  const st = 'scrollTop';
  const sh = 'scrollHeight';

  const pos = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);

  return isNaN(pos) ? 0 : pos;
}

const useScrollPosition = (
  effect: (position: number, offset: number) => void,
  dependencies: React.DependencyList | null
) => {
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const callback = () => {
    const currentPosition = getScrollPercent();
    const offset = document.documentElement.scrollTop || document.body.scrollTop;

    effect(currentPosition, offset);

    throttleTimeoutRef.current = null;
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (throttleTimeoutRef.current === null)
        throttleTimeoutRef.current = setTimeout(callback, THROTTLE_MS);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, dependencies);
};

export default useScrollPosition;
