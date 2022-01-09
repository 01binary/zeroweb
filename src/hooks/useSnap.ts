import { useState, useCallback, useEffect } from 'react';

const SNAP_TIME_MS = 400;

const useSnap = (onSnap: () => void) => {
  const [snapTimer, setSnapTimer] = useState<number>(0);

  const handleSnap = useCallback(() => {
    if (snapTimer) return;
    onSnap();
    setSnapTimer(
      window.setTimeout(() => {
        setSnapTimer(0);
      }, SNAP_TIME_MS)
    );
  }, [onSnap, setSnapTimer]);

  useEffect(() => () => window.clearTimeout(snapTimer), []);

  return [Boolean(snapTimer), handleSnap];
};

export default useSnap;
