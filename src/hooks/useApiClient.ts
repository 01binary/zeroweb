/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Apollo client setup for GraphQL API calls.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import { useEffect, useState } from 'react';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
import { AWSSignature } from '../auth/types';

// https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-generate-sdk-javascript.html
declare var apigClientFactory: any;
declare var dataLayer: any;

/**
 * Use AWS API Gateway client to make web requests
 * @param signature - The authentication tokens to make requests with
 * @returns API Gateway Apollo Link
 * @remarks If authentication is missing, don't create a link (this will return site info from cache)
 */
const configureApiGatewayLink = (signature: AWSSignature | null) => {
  if (!signature) return;

  const apigClient = apigClientFactory.newClient({
    accessKey: signature.accessKeyId,
    secretKey: signature.secretKey,
    sessionToken: signature.sessionToken,
    region: 'us-west-2',
  });

  return new HttpLink({
    fetch: (uri, { headers, body }) =>
      apigClient
        .graphqlPost({ headers }, JSON.parse(body.toString()))
        .then((res) => {
          const data = res.data;

          if (res.status === 401 || res.status === 403) {
            apigClient.authenticationExpired();
          } else if (res.status >= 300) {
            throw new Error(
              `Network request failed with ${res.status} (${res.statusText})`
            );
          } else if (
            !data.hasOwnProperty('data') &&
            !data.hasOwnProperty('errors')
          ) {
            throw new Error('Invalid GraphQL server response');
          }

          return new Response(JSON.stringify(res.data));
        }),
  });
};

/**
 * Configure a link for retrying failed requests
 * @returns Apollo link that can be plugged into from() to combine with other links
 */
const configureRetryLink = () =>
  new RetryLink({
    attempts: (count, operation, error) =>
      !!error && operation.operationName != 'specialCase',
    delay: (count, operation, error) => {
      console.error('Apollo retry', { operation, error });
      dataLayer &&
        dataLayer.push({
          event: 'network_retry',
          operation,
          error,
          count,
        });
      return count * 1000 * Math.random();
    },
  });

/**
 * Configure a link for reporting errors
 * @returns Apollo link that can be plugged into from() to combine with other links
 */
const configureErrorLink = () =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error('GraphQL error', { message, locations, path })
      );

    if (networkError) {
      console.error({ networkError });
      dataLayer &&
        dataLayer.push({
          event: 'network_error',
          error_message: networkError.message,
        });
    }
  });

/**
 * Use Local Storage to save the cache of API responses
 * @returns Local storage Apollo Storage
 */
const configureLocalStorage = () =>
  new LocalStorageWrapper(window.localStorage);

/**
 * Use In-Memory Cache to cache API responses
 * @returns In-memory cache as Apollo Cache
 */
const configureInMemoryCache = () =>
  new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          comments: {
            merge: (first, second) => second,
          },
        },
      },
    },
  });

/**
 * Configure empty Apollo Client
 * Used to avoid "ApolloProvider was not passed a client instance" from <ApolloProvider>
 */
const configureEmptyClient = () =>
  new ApolloClient({ cache: configureInMemoryCache() });

/**
 * Re-creates Apollo Client when authenticated
 * @param signature - The authentication tokens
 * @returns Apollo Client that can be used to make requests
 */
const useApiClient = (
  signature: AWSSignature | null
): ApolloClient<NormalizedCacheObject> => {
  const [client, setClient] = useState(configureEmptyClient());

  useEffect(() => {
    const requestLink = configureApiGatewayLink(signature);
    if (!requestLink) return;

    const link = from([
      configureErrorLink(),
      configureRetryLink(),
      requestLink,
    ]);

    const storage = configureLocalStorage();
    const cache = configureInMemoryCache();

    persistCache({ cache, storage }).then(() =>
      setClient(new ApolloClient({ cache, link }))
    );
  }, [signature, setClient]);

  return client;
};

export default useApiClient;
