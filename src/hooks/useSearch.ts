import { ChangeEvent, useCallback, useMemo } from 'react';
import { useBlogData } from './useBlogData';
import SEARCH_INDEX from '../../search.json';

const getSearchResults = (search?: string) => {
  if (!search || search.length < 4) return [];

  const tokens = search.split(' ').filter((token) => token.length > 3);

  return SEARCH_INDEX.filter(
    ({ title, body }) =>
      body.indexOf(search) >= 0 ||
      tokens.reduce((match, token) => match || title.indexOf(token) >= 0, false)
  );
};

export const useSearch = () => {
  const { search, setSearch } = useBlogData();

  const searchResults = useMemo(() => getSearchResults(search), [search]);

  const handleChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target?.value);
    },
    [setSearch]
  );

  const handleClearSearch = useCallback(() => setSearch(undefined), [
    setSearch,
  ]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => e.key === 'Escape' && handleClearSearch(),
    [handleClearSearch]
  );

  return {
    search,
    setSearch,
    searchResults,
    handleChangeSearch,
    handleClearSearch,
    handleKeyDown,
  };
};
