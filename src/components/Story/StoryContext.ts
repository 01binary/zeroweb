import React, { createContext } from 'react';
import { HideTipHandler, ShowTipForHandler } from '../../hooks/useTooltip';

type StoryContextState = {
  keywordRanges: Record<string, { min: Date; max: Date }>;
  totalExperience: number;
  autoCompleteKeywords?: string[];
  indexAutoCompleteKeywords(keywords: string[]): void;
  accumulateExperiences(keywords: string[], min: Date, max: Date): void;
  filter?: string;
  setFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
};

const StoryContext = createContext<StoryContextState>({
  keywordRanges: {},
  totalExperience: 0,
  setFilter: () => {},
  indexAutoCompleteKeywords: () => {},
  accumulateExperiences: () => {},
  showTipFor: () => {},
  hideTip: () => {},
});

export default StoryContext;
