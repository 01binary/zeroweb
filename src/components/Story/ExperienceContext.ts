import { createContext } from 'react';

type ExperienceContextState = {
  showDetails: boolean;
  details: string;
  setTitle(title: string): void;
  setDates(start: Date, end: Date): void;
  setCompany(company: string): void;
  setSummary(summary: string): void;
  setDetails(details: string): void;
  setStack(stack: string[]): void;
  setKeywords(keywords: string[]): void;
  toggleDetails(): void;
};

const ExperienceContext = createContext<ExperienceContextState>({
  showDetails: false,
  details: '',
  setTitle: () => {},
  setDates: () => {},
  setCompany: () => {},
  setSummary: () => {},
  setDetails: () => {},
  setStack: () => {},
  setKeywords: () => {},
  toggleDetails: () => {},
});

export default ExperienceContext;
