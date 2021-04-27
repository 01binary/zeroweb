/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Gatsby react rendering configuraiton.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import Code from './src/components/Code';
import Layout from './src/components/Layout';
import BlogContext from './src/components/BlogContext';
import Paragraph from './src/components/Paragraph';
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

export const wrapRootElement = ({ element }) => (
    <MDXProvider components={{
        h1: Heading1,
        h2: Heading2,
        h3: Heading3,
        h4: Heading4,
        pre: Code,
        table: Table,
        th: TableHeading,
        tr: TableRow,
        td: TableCell,
        p: Paragraph
    }}>
        {element}
    </MDXProvider>
);

export const wrapPageElement = ({ element, props }) => (
    <BlogContext.Provider value={{
        url: props.path,
        collection: props.path.split('/')[1]
    }}>
        <Layout {...props}>
            {element}
        </Layout>
    </BlogContext.Provider>
);
