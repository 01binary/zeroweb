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
import loadScript from './loadScript';
import { Providers, SetUserHandler } from '../auth/types';

const handleLogin = (
  setUser: SetUserHandler,
  who: any
) => {
  
};

export const twitterInit = (
  setUser: SetUserHandler
) => {
  loadScript('twitterapi', '?', () => {
    // TODO
  });
};

export const twitterLogin = (
  setUser: SetUserHandler
) => {
  // TODO
};

export const twitterLogout = (
  setUser: SetUserHandler
) => {
  // TODO
};
