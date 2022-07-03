import React, { ChangeEvent, FC, useMemo, useState } from 'react';
import styled from 'styled-components';
import { MOBILE } from '../../constants';
import SearchIcon from '../../images/search.svg';
import ClearIcon from '../../images/cancel.svg';
import { useCallback } from 'react';
import SEARCH_INDEX from '../../../search.json';

const SearchInput = styled.input`
  font-family: ${(props) => props.theme.smallFont};
  font-size: ${(props) => props.theme.smallFontSize};
  font-weight: ${(props) => props.theme.smallFontWeight};

  padding: ${(props) => props.theme.spacingQuarter};
  padding-left: ${(props) => props.theme.spacingOneAndHalf};
  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.foregroundColor};
  border: ${(props) => props.theme.border} solid
    ${(props) => props.theme.borderColor};

  &:focus {
    outline-color: ${(props) => props.theme.focusColor};
    outline-style: solid;
    outline-width: medium;
    border-radius: 1px;
  }
`;

const SearchIndicator = styled(SearchIcon)`
  position: absolute;
  top: calc(${(props) => props.theme.spacingQuarter});
  left: calc(${(props) => props.theme.spacingQuarter});

  @media (max-width: ${MOBILE}) {
    left: ${(props) => props.theme.spacing};
  }
`;

const SearchButton = styled.button`
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  width: 24px;
  height: 24px;

  svg {
    pointer-events: none;
  }

  &:hover {
    .stroke-foreground {
      stroke: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }

    .fill-foreground {
      fill: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }
  }
`;

const SearchSection = styled.section`
  position: relative;
`;

const Search: FC = () => {
  const [criteria, setCriteria] = useState<string | undefined>();

  const handleChangeSearch = useCallback((e: InputEvent) => {
    setCriteria(e.target?.value);
  }, []);

  const handleClearSearch = useCallback(() => setCriteria(undefined), []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => e.key === 'Escape' && handleClearSearch(),
    [handleClearSearch]
  );

  const results = useMemo(() => {
    if (!criteria || criteria.length < 4) return [];

    const tokens = criteria.split(' ');

    return SEARCH_INDEX.filter(({ title, body }) => {
      for (const index in tokens) {
        if (title.indexOf(tokens[index]) >= 0) {
          console.log('title', title, 'contains', tokens[index]);
          return true;
        }
      }

      if (body.indexOf(criteria) >= 0) {
        console.log('body for', title, 'contains', criteria);
        return true;
      }

      return false;
    });
  }, [criteria]);

  return (
    <SearchSection>
      <SearchInput
        value={criteria ?? ''}
        onChange={handleChangeSearch}
        onKeyDown={handleKeyDown}
        placeholder="search"
      />
      <SearchIndicator />
      <SearchButton onClick={handleClearSearch}>
        <ClearIcon />
      </SearchButton>
      <ul>
        {results.map((r) => (
          <li>
            {r.title} - {r.collection}
          </li>
        ))}
      </ul>
    </SearchSection>
  );
};

export default Search;
