import React, { FC, useEffect } from 'react';
import { useBlogContext } from '../hooks/useBlogContext';
import { facebookInit, facebookLogin } from '../auth/facebook';

const Login: FC = () => {
  const { user, setUser } = useBlogContext();

  useEffect(() => {
    facebookInit(setUser);
  }, [ facebookInit, facebookLogin ]);

  const handleLogin = () => facebookLogin(setUser);

  return user ? null : (
    <section>
      <button onClick={handleLogin}>Login</button> to comment
    </section>
  );
};

export default Login;
