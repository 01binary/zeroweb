import { ChangeEvent, useCallback, useMemo } from 'react';
import { useBlogContext } from './useBlogContext';
import SEARCH_INDEX from '../../search.json';

export const SEARCH_LENGTH = 3;

const getSearchResults = (search?: string) => {
  if (!search || search.length <= SEARCH_LENGTH) return [];

  const tokens = search
    .split(' ')
    .filter((token) => token.length > SEARCH_LENGTH);

  return SEARCH_INDEX.filter(
    ({ title, body }) =>
      body.indexOf(search) >= 0 ||
      tokens.reduce((match, token) => match || title.indexOf(token) >= 0, false)
  );
};

export const useSearch = () => {
  const { search, searchSticky, setSearch, setSearchSticky } = useBlogContext();

  const searchResults = useMemo(() => getSearchResults(search), [search]);

  const handleChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target?.value);
    },
    [setSearch]
  );

  const handleClearSearch = useCallback(() => {
    setSearch(undefined);
    setSearchSticky(false);
  }, [setSearch, setSearchSticky]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => e.key === 'Escape' && handleClearSearch(),
    [handleClearSearch]
  );

  return {
    search,
    setSearch,
    searchSticky,
    setSearchSticky,
    searchResults,
    handleChangeSearch,
    handleClearSearch,
    handleKeyDown,
  };
};
