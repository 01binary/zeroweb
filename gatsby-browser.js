import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import Code from './src/components/Code';
import Layout from './src/components/Layout';

const components = {
    pre: Code
};

export const wrapRootElement = ({ element }) => (
    <MDXProvider components={components}>
        {element}
    </MDXProvider>
);

export const wrapPageElement = ({ element, props }) => (
    <Layout {...props}>
        {element}
    </Layout>
);
