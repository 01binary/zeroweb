import { useEffect, useState } from 'react';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { AWSSignature } from '../auth/types';

// https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-generate-sdk-javascript.html
declare var apigClientFactory: any;

const useApiClient = (signature: AWSSignature): ApolloClient<NormalizedCacheObject> => {
  const [ client, setClient ] = useState(new ApolloClient({
    cache: new InMemoryCache(),
  }));

  useEffect(() => {
    if (!signature) return;

    const apigClient = apigClientFactory.newClient({
      accessKey: signature.accessKeyId,
      secretKey: signature.secretKey,
      sessionToken: signature.sessionToken,
      region: 'us-west-2'
    });

    const link = new HttpLink({ fetch: (uri, { headers, body }) =>
      apigClient.graphqlPost({ headers }, JSON.parse(body.toString()))
        .then((res) => {
          const data = res.data;

          if (res.status === 401 || res.status === 403) {
            apigClient.authenticationExpired();
          } else if (res.status >= 300) {
            throw new Error(`Network request failed with ${res.status} (${res.statusText})`);
          } else if (!data.hasOwnProperty('data') && !data.hasOwnProperty('errors')) {
            throw new Error('Invalid GraphQL server response');
          }

          return new Response(JSON.stringify(res.data));
        })
      });

      setClient(new ApolloClient({
        cache: new InMemoryCache({
          typePolicies: {
            Query: {
              fields: {
                comments: {
                  merge: (first, second) => second
                }
              }
            }
          }
        }),
        link
      }));
  }, [signature, setClient]);

  return client;
};

export default useApiClient;
