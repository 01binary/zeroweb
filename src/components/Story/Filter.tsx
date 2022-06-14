import React, { ChangeEvent, FC, useCallback, useContext } from 'react';
import {
  FilterButton,
  FilterIndicator,
  FilterInput,
  FilterSection,
} from './Story.styles';
import ClearIcon from '../../images/cancel.svg';
import StoryContext from './StoryContext';
import Contact from './Contact';

const Filter: FC = () => {
  const { filter, setFilter } = useContext(StoryContext);

  const handleChangeFilter = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value),
    [setFilter]
  );

  const handleClearFilter = useCallback(() => setFilter(undefined), [
    setFilter,
  ]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => e.key === 'Escape' && handleClearFilter(),
    [handleClearFilter]
  );

  return (
    <FilterSection>
      <FilterInput
        value={filter ?? ''}
        onChange={handleChangeFilter}
        onKeyDown={handleKeyDown}
        placeholder="filter skills &amp; experience"
      />
      <FilterIndicator />
      <FilterButton onClick={handleClearFilter}>
        <ClearIcon />
      </FilterButton>
      <Contact inline />
    </FilterSection>
  );
};

export default Filter;
