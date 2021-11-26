import React from 'react';

export const onRenderBody = (
  { setPostBodyComponents },
) => {
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
