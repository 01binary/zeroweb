/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Blog context used to get navigation location.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import { createContext, useContext } from 'react';

type BlogLocationContextProps = {
  path?: string;
  collection?: string;
};

export const BlogLocationContext = createContext<BlogLocationContextProps>({});

export const useBlogLocation: () => BlogLocationContextProps = () =>
  useContext(BlogLocationContext);
