import { createContext } from 'react';

interface IBlogContext {
    url: string,
    collection: string
};

const BlogContext = createContext<IBlogContext>({
    url: '',
    collection: ''
});

export default BlogContext;
