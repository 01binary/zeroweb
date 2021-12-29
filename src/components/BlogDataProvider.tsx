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
import { BlogDataContext } from '../hooks/useBlogData';
import { useLogin } from '../hooks/useLogin';

const BlogDataProvider: FC<RouteComponentProps> = ({ path, children }) => {
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
    <BlogDataContext.Provider
      value={{
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
    </BlogDataContext.Provider>
  );
};

export default BlogDataProvider;
