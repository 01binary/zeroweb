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

export const wrapPageElement = ({
  element,
  props
}) => (
  <Layout {...props}>
    {element}
  </Layout>
);
