/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Twitter authentication.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import dayjs from 'dayjs';
import axios from 'axios';
import { Providers, SetUserHandler } from '../auth/types';
import { AUTH_BASE_URL } from '../constants';

export const twitterInit = (
  setUser: SetUserHandler
) => {
  // TODO: check for twitter cookie
};

export const twitterLogin = (
  setUser: SetUserHandler
) => {
  axios
    .post(`${AUTH_BASE_URL}/twitter/oauth/request_token`)
    .then(({ data: { oauth_token } }) => {
      window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
    })
    .catch((error) => console.error(error));
};

export const twitterLogout = (
  setUser: SetUserHandler
) => {
  axios
    .post(`${AUTH_BASE_URL}/twitter/logout`)
    .then(() => setUser(null))
    .catch((error) => console.error(error));
};
