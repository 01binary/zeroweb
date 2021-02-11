import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import Code from './src/components/Code';

const components = {
    pre: Code
};

export const wrapRootElement = ({ element }) => (
    <MDXProvider components={components}>
        {element}
    </MDXProvider>
);
