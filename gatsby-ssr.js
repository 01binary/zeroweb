/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Gatsby static rendering configuraiton.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React from 'react';
import Layout from './src/components/Layout';
import UserContentProvider from './src/components/UserContentProvider';
import { lightTheme as theme } from './src/theme';

export const wrapPageElement = ({
  element,
  props
}) => (
  <Layout {...props}>
    {element}
  </Layout>
);

export const wrapRootElement = ({ element }) => (
  <UserContentProvider>
    {element}
  </UserContentProvider>
);

export const onRenderBody = ({
  setHtmlAttributes,
  setPostBodyComponents
}) => {
  const style = Object
    .keys(theme)
    .reduce((cssProperties, key) => {
      cssProperties[`--${key}`] = theme[key]
      return cssProperties;
    }, {});

  setHtmlAttributes({ style });
  setPostBodyComponents([
    <script key="axios" type="text/javascript" src="/lib/axios/dist/axios.standalone.js"></script>,
    <script key="hmac-sha256" type="text/javascript" src="/lib/CryptoJS/rollups/hmac-sha256.js"></script>,
    <script key="sha256" type="text/javascript" src="/lib/CryptoJS/rollups/sha256.js"></script>,
    <script key="hmac" type="text/javascript" src="/lib/CryptoJS/components/hmac.js"></script>,
    <script key="enc-base64" type="text/javascript" src="/lib/CryptoJS/components/enc-base64.js"></script>,
    <script key="url-template" type="text/javascript" src="/lib/url-template/url-template.js"></script>,
    <script key="sigclient" type="text/javascript" src="/lib/apiGatewayCore/sigV4Client.js"></script>,
    <script key="apigwcoreclient" type="text/javascript" src="/lib/apiGatewayCore/apiGatewayClient.js"></script>,
    <script key="httpclient" type="text/javascript" src="/lib/apiGatewayCore/simpleHttpClient.js"></script>,
    <script key="utils" type="text/javascript" src="/lib/apiGatewayCore/utils.js"></script>,
    <script key="apigclient" type="text/javascript" src="/apigClient.js"></script>,
  ]);
};
