import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSearch } from '../../hooks/useSearch';
import SearchIcon from '../../images/search.svg';
import ClearIcon from '../../images/cancel.svg';
import ArticleIcon from '../../images/articles.svg';
import ProjectIcon from '../../images/projects.svg';
import { MOBILE } from '../../constants';
import { Link } from 'gatsby';

const getArticleUrl = (slug: string) => `/articles/${slug}`;

const getProjectUrl = (slug: string) => `/projects/${slug}`;

const getProjectLogUrl = (slug: string) => {
  const [, project, log] = slug.split('/');
  return `/projects/${project}/${log}`;
};

const getSearchResultUrl = (slug: string, collection: string) => {
  if (collection === 'logs') return getProjectLogUrl(slug);
  if (collection === 'projects') return getProjectUrl(slug);
  return getArticleUrl(slug);
};

const ArticleResultIcon = styled(ArticleIcon)`
  position: relative;
  top: ${(props) => props.theme.borderThick};
  margin-right: ${(props) => props.theme.spacingHalf};

  stroke-width: 1.5;

  .stroke-foreground {
    stroke: white;
  }

  .stroke-background {
    stroke: #ffffff99;
  }
`;

const ProjectResultIcon = styled(ProjectIcon)`
  position: relative;
  top: ${(props) => props.theme.borderThick};
  margin-right: ${(props) => props.theme.spacingHalf};

  stroke-width: 1.5;

  .stroke-foreground {
    stroke: white;
  }

  .stroke-background {
    stroke: #ffffffbb;
  }
`;

const SearchInput = styled.input<{ fullScreen?: boolean }>`
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
  color: ${(props) => props.theme.foregroundColor};
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
    outline-color: ${(props) => props.theme.alwaysLightColor};
    outline-style: solid;
    outline-width: medium;
    border-radius: 1px;
  }

  @media (max-width: ${MOBILE}) {
    color: ${(props) =>
      props.fullScreen
        ? props.theme.alwaysLightColor
        : props.theme.foregroundColor};

    &::placeholder {
      color: ${(props) =>
        props.fullScreen
          ? props.theme.alwaysLightColor
          : props.theme.foregroundColor};
    }

    outline-color: ${(props) =>
      props.fullScreen
        ? props.theme.alwaysLightColor
        : props.theme.foregroundColor}99;

    padding-left: calc(
      ${(props) => props.theme.spacing} +
        ${(props) => props.theme.spacingQuarter}
    );

    padding-right: 0;

    &:focus {
      outline-color: ${(props) =>
        props.fullScreen
          ? props.theme.alwaysLightColor
          : props.theme.foregroundColor};
    }
  }
`;

const SearchIndicator = styled(SearchIcon)<{ fullScreen?: boolean }>`
  position: absolute;
  top: calc(
    ${(props) => props.theme.spacingQuarter} - ${(props) => props.theme.border}
  );
  left: ${(props) => props.theme.spacingQuarter};
  stroke: ${(props) => props.theme.alwaysLightColor};

  @media (max-width: ${MOBILE}) {
    left: ${(props) => props.theme.spacingQuarter};
    stroke: ${(props) =>
      props.fullScreen
        ? props.theme.alwaysLightColor
        : props.theme.foregroundColor};
  }
`;

const ClearButton = styled.button<{ fullScreen?: boolean }>`
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
    stroke: #ffffff99;
  }

  &:hover {
    .stroke-foreground {
      stroke: ${(props) => props.theme.foregroundColor};
    }
  }

  @media (max-width: ${MOBILE}) {
    .stroke-foreground {
      stroke: ${(props) =>
        props.fullScreen
          ? props.theme.alwaysLightColor
          : props.theme.foregroundColor}99;
    }

    &:hover {
      .stroke-foreground {
        stroke: ${(props) =>
          props.fullScreen
            ? props.theme.alwaysLightColor
            : props.theme.foregroundColor};
      }
    }
  }
`;

const SearchSection = styled.section`
  position: absolute;
  right: ${(props) => props.theme.spacing};
  bottom: ${(props) => props.theme.spacingDouble};
  min-width: 320px;

  @media (max-width: ${MOBILE}) {
    bottom: initial;
    right: calc(${(props) => props.theme.spacing} * 4.5);
    top: calc(
      ${(props) => props.theme.spacingQuarter} +
        ${(props) => props.theme.border} * 2
    );
    min-width: 8em;
  }
`;

const SearchScreen = styled.main`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-items: center;

  max-width: initial;
  margin: initial;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  animation: searchFadeIn ${(props) => props.theme.animationSlow} ease-out 1;

  @keyframes searchFadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  background: linear-gradient(
    135deg,
    ${(props) => props.theme.primaryColor} 0%,
    ${(props) => props.theme.secondaryColor} 100%
  );

  &:before {
    float: initial;
    position: absolute;
    left: ${(props) => props.theme.spacingDouble};
    top: ${(props) => props.theme.spacingDouble};
    width: 0;
    color: ${(props) => props.theme.alwaysLightColor};
  }

  &:after {
    float: initial;
    position: absolute;
    right: ${(props) => props.theme.spacingDouble};
    bottom: ${(props) => props.theme.spacingDouble};
    color: ${(props) => props.theme.alwaysLightColor};
  }
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

  font-family: ${(props) => props.theme.normalFont};
  font-size: ${(props) => props.theme.normalFontSize};
  font-weight: ${(props) => props.theme.normalFontWeight};
  line-height: ${(props) => props.theme.normalFontLineHeight};

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

  text-transform: lowercase;
  animation: slideIn ${(props) => props.theme.animationSlow} ease-out 1;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media (max-width: ${MOBILE}) {
    margin: 0;
  }
`;

const SearchLink = styled(Link)`
  color: ${(props) => props.theme.alwaysLightColor};

  &:hover {
    color: ${(props) => props.theme.alwaysLightColor}BB;
  }
`;

export const InlineSearch: FC = () => {
  const {
    search,
    handleChangeSearch,
    handleClearSearch,
    handleKeyDown,
  } = useSearch();

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
    setSearchSticky,
    handleChangeSearch,
    handleClearSearch,
    handleKeyDown,
  } = useSearch();

  useEffect(() => {
    window.setTimeout(() => searchBoxRef.current?.focus());
    setSearchSticky(true);
  }, [setSearchSticky]);

  console.log('search', searchResults);

  return (
    <SearchScreen>
      <SearchForm>
        <SearchInput
          ref={searchBoxRef}
          fullScreen
          value={search ?? ''}
          onChange={handleChangeSearch}
          onKeyDown={handleKeyDown}
          placeholder="search"
        />
        <SearchIndicator fullScreen />
        {search?.length ? (
          <ClearButton fullScreen onClick={handleClearSearch}>
            <ClearIcon />
          </ClearButton>
        ) : null}
      </SearchForm>
      {searchResults.length ? (
        <SearchResults>
          {searchResults.map(({ slug, title, collection }) => (
            <SearchResult key={slug}>
              <SearchLink
                to={getSearchResultUrl(slug, collection)}
                onClick={handleClearSearch}
              >
                {collection === 'articles' ? (
                  <ArticleResultIcon />
                ) : (
                  <ProjectResultIcon />
                )}
                {title}
              </SearchLink>
            </SearchResult>
          ))}
        </SearchResults>
      ) : null}
    </SearchScreen>
  );
};
