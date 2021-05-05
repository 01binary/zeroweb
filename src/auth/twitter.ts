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

export const twitterInit = (
  setUser: SetUserHandler
) => {
  // TODO: check for twitter cookie
};

export const twitterLogin = (
  setUser: SetUserHandler
) => {
  axios
    .get('https://mb6oojneq8.execute-api.us-west-2.amazonaws.com/Prod/twitter',
      { headers: { 'Content-Type': 'text/html' } })
    .then(res => {
      console.log('twitter login res', res);
    });
};

export const twitterLogout = (
  setUser: SetUserHandler
) => {
  // TODO: delete cookie
};
