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

export interface User {
  id: string;
  name: string;
  provider: Providers;
  token: string;
  expires?: dayjs.Dayjs;
  imageUrl?: string;
};

export type SetUserHandler = (user: User) => void;
