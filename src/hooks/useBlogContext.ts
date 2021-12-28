/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Blog context used to get current page route information.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import { createContext, useContext } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  User,
  SetUserHandler,
  SetCredentialsHandler,
  AWSSignature,
} from '../auth/types';

type BlogContextProps = {
  url: string;
  collection: string;
  client: ApolloClient<NormalizedCacheObject> | null;
  user: User | null;
  credentials: AWSSignature | null;
  loginError: string | null;
  setUser: SetUserHandler;
  setCredentials: SetCredentialsHandler;
  handleFacebookLogin: () => void;
  handleTwitterLogin: () => void;
  handleGoogleLogin: () => void;
  handleLogout: () => void;
};

export const BlogContext = createContext<BlogContextProps>({
  url: '',
  collection: '',
  user: null,
  client: null,
  credentials: null,
  loginError: null,
  setUser: null,
  setCredentials: null,
  handleFacebookLogin: null,
  handleTwitterLogin: null,
  handleGoogleLogin: null,
  handleLogout: null,
});

export const useBlogContext: () => BlogContextProps = () =>
  useContext(BlogContext);
