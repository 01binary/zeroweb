import { createContext } from 'react';

type ExperienceContextState = {
  showDetails: boolean;
  details: string;
  setTitle(title: string): void;
  setCompany(company: string): void;
  setSummary(summary: string): void;
  setDetails(details: string): void;
  setStack(stack: string[]): void;
  setKeywords(keywords: string[]): void;
  toggleDetails(): void;
};

const ExperienceContext = createContext<Partial<ExperienceContextState>>({});

export default ExperienceContext;
