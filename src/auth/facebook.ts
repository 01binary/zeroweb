import dayjs from 'dayjs';
import { Providers, SetUserHandler } from '../auth/types';

enum LoginStatus {
  Connected = 'connected',
  NotAuthorized = 'not_authorized',
  Unknown = 'unknown'
};

interface AuthResponse {
  userID: string;
  accessToken: string;
  expiresIn: number;
};

interface LoginResponse {
  status: LoginStatus;
  authResponse: AuthResponse;
};

const handleLogin = (
  setUser: SetUserHandler,
  {
    status,
    authResponse
  }: LoginResponse,
) => {
  if (status === LoginStatus.Connected) {
    const {
      userID: id,
      accessToken: token,
      expiresIn
    } = authResponse;

    FB.api(
      '/me?fields=first_name,last_name',
      ({ first_name, last_name }) => {
        setUser({
          provider: Providers.Facebook,
          id,
          name: `${first_name} ${last_name}`,
          token,
          expires: dayjs().add(expiresIn, 'seconds'),
        });
      });
  }
};

export const facebookInit = (
  setUser: SetUserHandler
) => {
  // Facebook SDK knows to call fbAsyncInit after it loads
  window.fbAsyncInit = () => {
    FB.init({
      appId: '528437335196727',
      // Persist login in cookie
      cookie: true,
      // Parse social logins
      xfbml: true,
      version: 'v10.0'
    });

    FB.getLoginStatus(res => res && handleLogin(setUser, res));
  };
};

export const facebookLogin = (
  setUser: SetUserHandler
) => FB.login(
  res => res && handleLogin(setUser, res),
  { scope: 'public_profile' }
);
