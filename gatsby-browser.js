import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import Code from './src/components/Code';
import Layout from './src/components/Layout';
import { Theme, GlobalStyle } from './src/components/Theme';
import {
    Table,
    TableHeading,
    TableRow,
    TableCell
} from './src/components/Table';

export const wrapRootElement = ({ element }) => (
    <Theme>
        <GlobalStyle />
        <MDXProvider components={{
            pre: Code,
            table: Table,
            th: TableHeading,
            tr: TableRow,
            td: TableCell
        }}>
            {element}
        </MDXProvider>
    </Theme>
);

export const wrapPageElement = ({ element, props }) => (
    <Layout {...props}>
        {element}
    </Layout>
);
