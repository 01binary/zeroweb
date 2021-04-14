import { createContext } from 'react';

interface BlogContextProps {
    url: string;
    collection: string;
};

const BlogContext = createContext<BlogContextProps>({ url: '', collection: '' });

export default BlogContext;
