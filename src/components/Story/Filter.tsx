import React, {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  FilterButton,
  FilterIndicator,
  FilterInput,
  FilterSection,
} from './Story.styles';
import autocomplete, { AutocompleteResult } from 'autocompleter';
import ClearIcon from '../../images/cancel.svg';
import StoryContext from './StoryContext';
import Contact from './Contact';

const Filter: FC = () => {
  const inputRef = useRef<HTMLInputElement>();
  const autoRef = useRef<AutocompleteResult>();
  const { filter, autoCompleteKeywords, setFilter } = useContext(StoryContext);

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

  useEffect(() => {
    if (!inputRef.current) return;
    if (!autoCompleteKeywords?.length) return;

    if (autoRef.current) {
      autoRef.current.destroy();
      autoRef.current = undefined;
    }

    autoRef.current = autocomplete({
      input: inputRef.current,
      fetch: (text, update) => {
        const searchTerms = text.toLowerCase().split(' ');
        const search = searchTerms[searchTerms.length - 1];
        if (!search?.length) return;
        update(
          (autoCompleteKeywords || [])
            .filter((keyword) => keyword.startsWith(search))
            .map((keyword) => ({ label: keyword, value: keyword }))
        );
      },
      onSelect: (item) =>
        setFilter((filter) => {
          return filter
            ? filter
                .split(' ')
                .slice(undefined, -1)
                .concat(item?.label || '')
                .join(' ')
            : '';
        }),
    });
  }, [autoCompleteKeywords]);

  return (
    <FilterSection>
      <FilterInput
        ref={inputRef}
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
