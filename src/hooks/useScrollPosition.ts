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

import React, { useLayoutEffect } from 'react';

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
  effect: (position: number) => void,
  dependencies: React.DependencyList | null
) => {
  let throttleTimeout: ReturnType<typeof setTimeout> = null;

  const callback = () => {
    const currentPosition = getScrollPercent();
    effect(currentPosition);
    throttleTimeout = null;
  };

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (throttleTimeout === null) throttleTimeout = setTimeout(callback, 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, dependencies);
};

export default useScrollPosition;
