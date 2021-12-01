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

import React, { FC, useContext, useState } from 'react';
import { ThemeContext } from 'styled-components';
import { ApolloProvider } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';
import { BlogContext } from '../hooks/useBlogContext';
import { GlobalStyle } from '../theme';
import useApiClient from '../hooks/useApiClient';
import SEO from './SEO';
import Header from './Header';
import { AWSSignature, User } from '../auth/types';

const getCollection = (path?: string): string => path?.split('/')?.[1];

const Layout: FC<RouteComponentProps> = ({ path, children, location }) => {
  const theme = useContext(ThemeContext);
  const [user, setUser] = useState<User>(null);
  const [credentials, setCredentials] = useState<AWSSignature>(null);
  const client = useApiClient(credentials);

  if (credentials) console.log('credentials', credentials);
  if (user) console.log('user', user);

  return (
    <BlogContext.Provider
      value={{
        url: path,
        collection: getCollection(path),
        client: client,
        user,
        credentials,
        setUser,
        setCredentials,
      }}
    >
      <ApolloProvider client={client}>
        <SEO />
        <GlobalStyle theme={theme} />
        <Header path={location.pathname} />
        {children}
      </ApolloProvider>
    </BlogContext.Provider>
  );
};

export default Layout;
