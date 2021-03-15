import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import Code from './src/components/Code';
import Layout from './src/components/Layout';
import { GlobalStyle } from './src/components/GlobalStyle';
import BlogContext from './src/components/BlogContext';
import { ThemeProvider } from './src/components/ThemeContext';
import {
    Heading1,
    Heading2,
    Heading3,
    Heading4
} from './src/components/Heading';
import {
    Table,
    TableHeading,
    TableRow,
    TableCell
} from './src/components/Table';

export const wrapRootElement = ({
    element
}) => (
    <ThemeProvider>
        <GlobalStyle />
        <MDXProvider components={{
            h1: Heading1,
            h2: Heading2,
            h3: Heading3,
            h4: Heading4,
            pre: Code,
            table: Table,
            th: TableHeading,
            tr: TableRow,
            td: TableCell
        }}>
            {element}
        </MDXProvider>
    </ThemeProvider>
);

export const wrapPageElement = ({
    element,
    props
}) => (
    <BlogContext.Provider value={{
        url: props.path,
        collection: props.path.split('/')[1]
    }}>
        <Layout {...props}>
            {element}
        </Layout>
    </BlogContext.Provider>
);
