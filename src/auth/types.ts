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
  userId: string;
  accessKeyId?: string;
  secretKey?: string;
  sessionToken?: string;
  expires: dayjs.Dayjs;
};

export type User = {
  name: string;
  provider: Providers;
  providerUserId: string;
  token: string;
  expires?: dayjs.Dayjs;
  avatarUrl?: string;
};

export type SetUserHandler = (user: User) => void;
export type SetErrorHandler = (message: string) => void;
export type SetCredentialsHandler = (credentials: AWSSignature) => void;
