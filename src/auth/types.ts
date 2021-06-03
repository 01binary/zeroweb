/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Authentication types.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import dayjs from 'dayjs';

export enum Providers {
  Facebook = 'facebook',
  Twitter = 'twitter',
  Google = 'google',
  GitHub = 'github',
};

export type AWSSignature = {
  accessKeyId?: string;
  secretKey?: string;
  sessionToken?: string;
  expires: dayjs.Dayjs;
};

export interface User {
  id: string;
  name: string;
  provider: Providers;
  token: string;
  expires?: dayjs.Dayjs;
  avatarUrl?: string;
};

export type SetUserHandler = (user: User) => void;
export type SetErrorHandler = (message: string) => void;
export type SetCredentialsHandler = (credentials: AWSSignature) => void;
