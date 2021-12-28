/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Blog context provider.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useState, createContext, useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import { ApolloProvider } from '@apollo/client';
import useApiClient from '../hooks/useApiClient';
import { User, AWSSignature } from '../auth/types';
import { BlogContext } from '../hooks/useBlogContext';
import { useLogin } from '../hooks/useLogin';

const getCollection = (path?: string): string => path?.split('/')?.[1];

const BlogProvider: FC<RouteComponentProps> = ({ path, children }) => {
  const [user, setUser] = useState<User>(null);
  const [credentials, setCredentials] = useState<AWSSignature>(null);
  const client = useApiClient(credentials);
  const {
    handleFacebookLogin,
    handleGoogleLogin,
    handleTwitterLogin,
    handleLogout,
    loginError,
  } = useLogin(user, setUser, setCredentials);

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
        loginError,
        setUser,
        setCredentials,
        handleFacebookLogin,
        handleGoogleLogin,
        handleTwitterLogin,
        handleLogout,
      }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </BlogContext.Provider>
  );
};

export default BlogProvider;
