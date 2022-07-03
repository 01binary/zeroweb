import React, { createContext } from 'react';
import { HideTipHandler, ShowTipForHandler } from '../../hooks/useTooltip';

type StoryContextState = {
  autoCompleteKeywords?: string[];
  indexAutoCompleteKeywords(keywords: string[]): void;
  filter?: string;
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
};

const StoryContext = createContext<StoryContextState>({
  setFilter: () => {},
  indexAutoCompleteKeywords: () => {},
  showTipFor: () => {},
  hideTip: () => {},
});

export default StoryContext;
