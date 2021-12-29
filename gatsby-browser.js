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
import Layout from './src/components/Layout';
import BlogDataProvider from './src/components/BlogDataProvider';

export const wrapPageElement = ({
  element,
  props
}) => (
  <Layout {...props}>
    {element}
  </Layout>
);

export const wrapRootElement = ({ element }) => (
  <BlogDataProvider>
    {element}
  </BlogDataProvider>
);
