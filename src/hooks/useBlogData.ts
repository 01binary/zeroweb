/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Blog context used to query user generated content
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { createContext, useContext } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  User,
  SetUserHandler,
  SetCredentialsHandler,
  AWSSignature,
} from '../auth/types';

type BlogDataContextProps = {
  client: ApolloClient<NormalizedCacheObject> | null;
  user: User | null;
  credentials: AWSSignature | null;
  loginError: string | null;
  showCommentsSidebar: boolean;
  anchor: string | null;
  search?: string;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  setAnchor: React.Dispatch<React.SetStateAction<string | null>>;
  setShowCommentsSidebar: (showCommentsSidebar: boolean) => void;
  toggleCommentsSidebar: () => void;
  setUser: SetUserHandler;
  setCredentials: SetCredentialsHandler;
  handleFacebookLogin: () => void;
  handleTwitterLogin: () => void;
  handleGoogleLogin: () => void;
  handleGithubLogin: () => void;
  handleLogout: () => void;
};

export const BlogDataContext = createContext<BlogDataContextProps>({
  user: null,
  client: null,
  credentials: null,
  loginError: null,
  anchor: null,
  showCommentsSidebar: false,
  setSearch: () => {},
  setUser: () => {},
  setAnchor: () => {},
  setShowCommentsSidebar: () => {},
  toggleCommentsSidebar: () => {},
  setCredentials: () => {},
  handleFacebookLogin: () => {},
  handleTwitterLogin: () => {},
  handleGoogleLogin: () => {},
  handleGithubLogin: () => {},
  handleLogout: () => {},
});

export const useBlogData: () => BlogDataContextProps = () =>
  useContext(BlogDataContext);
