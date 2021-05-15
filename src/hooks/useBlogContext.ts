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
import { User, SetUserHandler, SetCredentialsHandler } from '../auth/types';

interface BlogContextProps {
  url: string;
  collection: string;
  user: User;
  setUser: SetUserHandler;
  setCredentials: SetCredentialsHandler;
};

export const BlogContext = createContext<BlogContextProps>({
  url: '',
  collection: '',
  user: null,
  setUser: null,
  setCredentials: null,
});

export const useBlogContext: () => BlogContextProps = () => (
  useContext(BlogContext)
);
