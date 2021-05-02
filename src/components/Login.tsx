import React, { FC, useEffect } from 'react';
import { useBlogContext } from '../hooks/useBlogContext';
import { facebookInit, facebookLogin } from '../auth/facebook';
import { googleInit, googleLogin } from '../auth/google';

const Login: FC = () => {
  const { user, setUser } = useBlogContext();

  useEffect(() => {
    facebookInit(setUser);
    googleInit(setUser);
  }, [
    facebookInit,
    googleLogin,
    setUser,
  ]);

  const handleFacebookLogin = () => facebookLogin(setUser);
  const handleGoogleLogin = () => googleLogin(setUser);

  return user
    ? (
      <div>Logged in with {user.provider}</div>
    )
    : (
      <section>
        Login to comment:
        <ul>
          <li><button onClick={handleFacebookLogin}>Facebook</button></li>
          <li><button onClick={handleGoogleLogin}>Google</button></li>
        </ul>
      </section>
    );
};

export default Login;
