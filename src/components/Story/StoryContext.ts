import { createContext } from 'react';
import { HideTipHandler, ShowTipForHandler } from '../../hooks/useTooltip';

type StoryContextState = {
  filter?: string;
  setFilter(filter: string): void;
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
};

const StoryContext = createContext<StoryContextState>({
  setFilter: () => {},
  showTipFor: () => {},
  hideTip: () => {},
});

export default StoryContext;
