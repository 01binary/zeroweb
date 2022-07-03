/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Provides access to user and user-generated content.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { ApolloProvider } from '@apollo/client';
import useApiClient from '../hooks/useApiClient';
import { User, AWSSignature } from '../auth/types';
import { BlogDataContext } from '../hooks/useBlogData';
import { useLogin } from '../hooks/useLogin';
import { useCallback } from 'react';

const UserContentProvider: FC<RouteComponentProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [anchor, setAnchor] = useState<string | null>(null);
  const [showCommentsSidebar, setShowCommentsSidebar] = useState(false);
  const [search, setSearch] = useState<string | undefined>();
  const [credentials, setCredentials] = useState<AWSSignature | null>(null);
  const client = useApiClient(credentials);
  const {
    handleFacebookLogin,
    handleGoogleLogin,
    handleTwitterLogin,
    handleGithubLogin,
    handleLogout,
    loginError,
  } = useLogin(user, setUser, setCredentials);

  if (credentials) console.log('credentials', credentials);
  if (user) console.log('user', user);

  const toggleCommentsSidebar = useCallback(
    () => setShowCommentsSidebar((show) => !show),
    [setShowCommentsSidebar]
  );

  return (
    <BlogDataContext.Provider
      value={{
        client: client,
        user,
        credentials,
        loginError,
        showCommentsSidebar,
        anchor,
        search,
        setSearch,
        setAnchor,
        setShowCommentsSidebar,
        toggleCommentsSidebar,
        setUser,
        setCredentials,
        handleFacebookLogin,
        handleGoogleLogin,
        handleTwitterLogin,
        handleGithubLogin,
        handleLogout,
      }}
    >
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </BlogDataContext.Provider>
  );
};

export default UserContentProvider;
