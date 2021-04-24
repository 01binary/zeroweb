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

import { createContext } from 'react';

interface BlogContextProps {
  url: string;
  collection: string;
};

const BlogContext = createContext<BlogContextProps>(
  {
    url: '',
    collection: '' 
  }
);

export default BlogContext;
