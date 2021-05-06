/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Twitter sign-in redirect page.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import axios from 'axios';
import dayjs from 'dayjs';
import queryString from 'query-string';
import React, { FC, useEffect } from 'react';
import { useBlogContext } from '../hooks/useBlogContext';
import Title from '../components/Title';
import Summary from '../components/Summary';
import { Providers } from '../auth/types';
import { AUTH_BASE_URL } from '../constants';

// TODO: make this a dialog?
const TwitterRedirect: FC = () => {
  const { user, setUser } = useBlogContext();

  useEffect(() => {
    const { oauth_token, oauth_verifier } = queryString.parse(window.location.search);

    if (oauth_token && oauth_verifier) {
      axios
        .post(`${AUTH_BASE_URL}/twitter/oauth/access_token`, {
          oauth_token,
          oauth_verifier
        })
        .then(() => {
          axios
            .get(`${AUTH_BASE_URL}/twitter/user`)
            .then(({ data }) => {
              const {
                name,
                profile_image_url_https,
                status,
                entities
              } = data;

              console.log('twitter', name, profile_image_url_https, status, entities);

              setUser({
                provider: Providers.Twitter,
                id: '?',
                name,
                token: '?',
                expires: dayjs()
              });
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
    }
  });

  return (
    <main>
      <Title collection="about">Logging you in</Title>
      <Summary>
        Please wait while you are logging in with twitter
        {window.location.search}
        {document.cookie}
      </Summary>
    </main>
  );
};

export default TwitterRedirect;
