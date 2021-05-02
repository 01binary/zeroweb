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
import { User, SetUserHandler } from '../auth/types';

interface BlogContextProps {
  url: string;
  collection: string;
  user: User;
  setUser: SetUserHandler;
};

export const BlogContext = createContext<BlogContextProps>({
  url: '',
  collection: '',
  user: null,
  setUser: null
});

export const useBlogContext: () => BlogContextProps = () => (
  useContext(BlogContext)
);
