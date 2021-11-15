/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Blog page layout template (used for all pages).
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useContext, useState } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { ThemeContext } from "styled-components";
import { RouteComponentProps } from '@reach/router';
import { BlogContext } from '../hooks/useBlogContext';
import { GlobalStyle } from '../theme';
import SEO from './SEO';
import Header from './Header';
import Code from '../components/Code';
import Paragraph from '../components/Paragraph';
import Blockquote from '../components/Blockquote';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4
} from '../components/Heading';
import {
  Table,
  TableHeading,
  TableRow,
  TableCell
} from '../components/Table';
import { AWSSignature, User } from '../auth/types';

const getCollection = (path?: string): string => path?.split('/')?.[1];

const Layout: FC<RouteComponentProps> = ({
  path,
  children,
  location
}) => {
  const theme = useContext(ThemeContext);
  const [ user, setUser ] = useState<User>(null);
  const [ credentials, setCredentials ] = useState<AWSSignature>(null);

  if (credentials) console.log('credentials', credentials);
  if (user) console.log('user', user);

  return (
    <BlogContext.Provider value={{
      url: path,
      collection: getCollection(path),
      user,
      credentials,
      setUser,
      setCredentials,
    }}>
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
        p: Paragraph,
        blockquote: Blockquote,
      }}>
        <SEO />
        <GlobalStyle theme={theme} />
        <Header path={location.pathname} />
        {children}
      </MDXProvider>
    </BlogContext.Provider>
  );
};

export default Layout;
