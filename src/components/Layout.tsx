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
import { ThemeContext } from 'styled-components';
import { RouteComponentProps } from '@reach/router';
import { BlogLocationContext } from '../hooks/useBlogLocation';
import { GlobalStyle } from '../theme';
import SEO from './SEO';
import Header from './Header';

const getCollection = (path?: string): string => path?.split('/')?.[1];

const Layout: FC<RouteComponentProps> = ({ children, location }) => {
  const theme = useContext(ThemeContext);
  return (
    <BlogLocationContext.Provider
      value={{
        path: location.pathname,
        collection: getCollection(location.pathname),
      }}
    >
      <SEO />
      <GlobalStyle theme={theme} />
      <Header path={location.pathname} />
      {children}
    </BlogLocationContext.Provider>
  );
};

export default Layout;
