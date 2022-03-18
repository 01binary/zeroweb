/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Blog page layout template (used for all pages).
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { RouteComponentProps } from '@reach/router';
import { BlogLocationContext } from '../hooks/useBlogLocation';
import { GlobalStyle } from '../theme';
import SEO from './SEO';
import Header from './Header';
import { useBlogData } from '../hooks/useBlogData';
import { NARROW_INLINE_COMMENTS, NARROW_SIDE_COMMENTS, SIDE_COMMENTS_WIDTH } from '../constants';

const Site = styled.div<{ showCommentsSidebar: true }>`
  transition: transform ${props => props.theme.animationFast} ease-in-out;

  @media (min-width: ${NARROW_SIDE_COMMENTS}) {
    transform: ${(props) =>
      props.showCommentsSidebar
        ? `translateX(-${SIDE_COMMENTS_WIDTH})`
        : 'none'};
  }

  @media (min-width: ${NARROW_INLINE_COMMENTS}) {
    transform: none;
  }
`;

const Layout: FC<RouteComponentProps> = ({ children, location }) => {
  const theme = useContext(ThemeContext);
  const { showCommentsSidebar } = useBlogData();
  return (
    <BlogLocationContext.Provider
      value={{
        path: location.pathname,
        collection: location.pathname?.split('/')?.[1],
      }}
    >
      <SEO />
      <GlobalStyle theme={theme} />
      <Site {...{showCommentsSidebar}}>
        <Header path={location.pathname} />
        {children}
      </Site>
    </BlogLocationContext.Provider>
  );
};

export default Layout;
