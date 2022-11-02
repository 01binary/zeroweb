import { useStaticQuery, graphql } from 'gatsby';
import { ChangeEvent, useCallback, useMemo } from 'react';
import type { AllPostsQuery } from '../types/AllPostsQuery';
import { useBlogContext } from './useBlogContext';

export const MIN_SEARCH_LENGTH = 3;

type SearchIndexEntry = {
  slug: string;
  collection: string;
  title: string;
  tags: string[];
  description: string;
  body: string;
};

const useSearchIndex = () => {
  const {
    allMdx: { nodes },
  } = useStaticQuery<AllPostsQuery>(graphql`
    {
      allMdx {
        nodes {
          slug
          fields {
            collection
            subCollection
          }
          frontmatter {
            description
            tags
            title
          }
          rawBody
        }
      }
    }
  `);

  const searchIndex = useMemo(
    () =>
      nodes.reduce(
        (
          entries: SearchIndexEntry[],
          {
            slug,
            fields: { collection },
            rawBody,
            frontmatter: { description, tags, title },
          }
        ) => [
          ...entries,
          {
            slug,
            collection,
            title: title.toLowerCase(),
            tags,
            description: description.toLowerCase(),
            body: rawBody ? rawBody.replace('\n', ' ') : '',
          },
        ],
        []
      ),
    [nodes]
  );

  return searchIndex;
};

const getSearchResults = (entries: SearchIndexEntry[], search?: string) => {
  if (!search || search.length <= MIN_SEARCH_LENGTH) return [];

  const tokens = search.split(' ').map((token) => token.toLowerCase());

  return entries.filter(
    ({ title, body }) =>
      body.indexOf(search) >= 0 ||
      tokens.reduce((match, token) => match || title.indexOf(token) >= 0, false)
  );
};

export const useSearch = () => {
  const { search, searchSticky, setSearch, setSearchSticky } = useBlogContext();
  const index = useSearchIndex();
  const results = useMemo(() => getSearchResults(index, search), [
    search,
    index,
  ]);

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
    searchResults: results,
    handleChangeSearch,
    handleClearSearch,
    handleKeyDown,
  };
};
