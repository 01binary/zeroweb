import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSearch } from '../../hooks/useSearch';
import SearchIcon from '../../images/search.svg';
import ClearIcon from '../../images/cancel.svg';
import { MOBILE } from '../../constants';
import { Link } from 'gatsby';

const SearchInput = styled.input`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;

  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  padding: ${(props) => props.theme.spacingQuarter};
  padding-left: ${(props) => props.theme.spacingOneAndHalf};
  padding-right: ${(props) => props.theme.spacingOneAndHalf};
  background: transparent;
  color: ${(props) => props.theme.foregroudColor};
  border: none;
  outline-color: #ffffff55;
  outline-style: solid;
  outline-width: medium;
  border-radius: 1px;

  color: ${(props) => props.theme.alwaysLightColor};

  &::placeholder {
    color: ${(props) => props.theme.alwaysLightColor};
  }

  &:focus {
    outline-color: ${(props) => props.theme.focusColor};
    outline-style: solid;
    outline-width: medium;
    border-radius: 1px;
  }
`;

const SearchIndicator = styled(SearchIcon)`
  position: absolute;
  top: calc(
    ${(props) => props.theme.spacingQuarter} - ${(props) => props.theme.border}
  );
  left: calc(${(props) => props.theme.spacingQuarter});

  @media (max-width: ${MOBILE}) {
    left: ${(props) => props.theme.spacingHalf};
  }
`;

const ClearButton = styled.button`
  display: flex;
  justify-items: center;

  position: absolute;
  top: 4px;
  right: 0;

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  svg {
    pointer-events: none;
  }

  .stroke-foreground {
    stroke: white;
  }

  &:hover {
    .stroke-foreground {
      stroke: ${(props) => props.theme.focusColor};
    }
  }
`;

const SearchSection = styled.section`
  position: absolute;
  right: ${(props) => props.theme.spacing};
  bottom: ${(props) => props.theme.spacingDouble};
  min-width: 320px;
`;

const SearchScreen = styled.section`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-items: center;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: linear-gradient(
    135deg,
    ${(props) => props.theme.primaryColor} 0%,
    ${(props) => props.theme.secondaryColor} 100%
  );
`;

const SearchForm = styled.form`
  position: relative;
  max-width: calc(
    ${(props) => props.theme.column} - ${(props) => props.theme.spacing} * 3
  );
  width: 100%;
  margin: 10vw auto ${(props) => props.theme.spacing} auto;

  @media (max-width: ${MOBILE}) {
    margin: ${(props) => props.theme.spacingHalf};
    max-width: calc(100% - ${(props) => props.theme.spacing});
  }
`;

const SearchResults = styled.ul`
  width: 100%;
  max-width: ${(props) => props.theme.column};
  margin: 0 auto 0 auto;
  padding: ${(props) => props.theme.spacingHalf};
  flex: 1;

  @media (max-width: ${MOBILE}) {
    padding: 0;
    margin-top: ${(props) => props.theme.spacing};
  }
`;

const SearchResult = styled.li`
  display: flex;
  flex-direction: row;
  padding: ${(props) => props.theme.spacingHalf};
  padding-bottom: 0;
  margin: 0 ${(props) => props.theme.spacing};

  @media (max-width: ${MOBILE}) {
    margin: 0;
  }
`;

export const InlineSearch: FC = () => {
  const {
    search,
    handleChangeSearch,
    handleClearSearch,
    handleKeyDown,
  } = useSearch();

  if (search && search.length > 3) return null;

  return (
    <SearchSection>
      <SearchInput
        value={search ?? ''}
        onChange={handleChangeSearch}
        onKeyDown={handleKeyDown}
        placeholder="search"
      />
      <SearchIndicator />
      {search?.length ? (
        <ClearButton onClick={handleClearSearch}>
          <ClearIcon />
        </ClearButton>
      ) : null}
    </SearchSection>
  );
};

export const FullScreenSearch: FC = () => {
  const searchBoxRef = useRef<HTMLInputElement | undefined>();
  const {
    search,
    searchResults,
    handleChangeSearch,
    handleClearSearch,
    handleKeyDown,
  } = useSearch();

  useEffect(() => {
    window.setTimeout(() => searchBoxRef.current?.focus());
  }, [search]);

  if (!search || search?.length < 4) return null;

  return (
    <SearchScreen>
      <SearchForm>
        <SearchInput
          ref={searchBoxRef}
          value={search ?? ''}
          onChange={handleChangeSearch}
          onKeyDown={handleKeyDown}
          placeholder="search"
        />
        <SearchIndicator />
        {search?.length ? (
          <ClearButton onClick={handleClearSearch}>
            <ClearIcon />
          </ClearButton>
        ) : null}
      </SearchForm>
      {searchResults.length ? (
        <SearchResults>
          {searchResults.map(({ slug, title, collection }) => (
            <SearchResult onClick={handleClearSearch}>
              <Link to={'/' + collection + '/' + slug}>{title}</Link>
            </SearchResult>
          ))}
        </SearchResults>
      ) : null}
    </SearchScreen>
  );
};
