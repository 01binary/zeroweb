import { useEffect, useState } from 'react';
import { ApolloClient } from 'apollo-client';
import { BaseNetworkInterface } from 'apollo-client/transport/networkInterface';
import {
  AwsApiGwNetworkInterface
} from 'apollo-client-aws-ni/api-gw-connector';
import { AWSSignature } from '../auth/types';
import loadScript from '../auth/loadScript';
import { ExecutionResult } from 'graphql';

const SCRIPTS = [
  ['axios-standalone', '/lib/axios/dist/axios.standalone.js'],
  ['hmac-sha', '/lib/CryptoJS/rollups/hmac-sha256.js'],
  ['sha', '/lib/CryptoJS/rollups/sha256.js'],
  ['hmac', '/lib/CryptoJS/components/hmac.js'],
  ['enc', '/lib/CryptoJS/components/enc-base64.js'],
  ['url-template', '/lib/url-template/url-template.js'],
  ['sig', '/lib/apiGatewayCore/sigV4Client.js'],
  ['apigw-client', '/lib/apiGatewayCore/apiGatewayClient.js'],
  ['http-client', '/lib/apiGatewayCore/simpleHttpClient.js'],
  ['apigw-utils', '/lib/apiGatewayCore/utils.js'],
  ['api-client', '/apigClient.js']
];

declare var apigClientFactory: any;

class NotInitialized extends BaseNetworkInterface {
  constructor() {
    super('empty');
  }

  query(request: Request): Promise<ExecutionResult> {
    return Promise.reject();
  }
};

const useApiClient = (signature: AWSSignature): ApolloClient => {
  const [ client, setClient ] = useState(new ApolloClient({
    // Defer queries against the server until we get an authentication token
    networkInterface: new NotInitialized()
  }));

  useEffect(() => {
    if (!signature) return;

    Promise.all(
      SCRIPTS.reduce((loaded: Promise<string>[], [ id, url ]) => {
        loaded.push(loadScript(id, url));
        return loaded;
      }, [])
    ).then(() => {
      setTimeout(() => {
        const apigClient = apigClientFactory.newClient({
          accessKey: signature.accessKeyId,
          secretKey: signature.secretKey,
          sessionToken: signature.sessionToken,
          region: 'us-west-2'
        });
  
        apigClient.isAuthenticated = () => true;
  
        const networkInterface: any = new AwsApiGwNetworkInterface(apigClient);
        setClient(new ApolloClient({ networkInterface }));
      }, 100);
    });
  }, [signature, setClient]);

  return client;
};

export default useApiClient;
