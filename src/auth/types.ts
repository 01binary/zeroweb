import dayjs from 'dayjs';

export enum Providers {
  Facebook,
  Twitter,
  Google,
  GitHub
};

export interface User {
  id: string;
  name: string;
  provider: Providers;
  token: string;
  expires: dayjs.Dayjs;
};

export type SetUserHandler = (user: User) => void;
