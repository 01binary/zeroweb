/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Twitter sign-in redirect page.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useEffect, useState } from 'react';
import { useBlogContext } from '../hooks/useBlogContext';
import { twitterReturn } from '../auth/twitter';
import Title from '../components/Title';
import Summary from '../components/Summary';

// TODO: make this a dialog?
const TwitterRedirect: FC = () => {
  const [ once, setOnce ] = useState<boolean>(false);
  const { user, setUser } = useBlogContext();

  useEffect(() => {
    if (once) return;
    twitterReturn(setUser);
    setOnce(true);
  }, [ twitterReturn, setUser, once, setOnce ]);

  return (
    <main>
      <Title collection="about">Logging you in</Title>
      <Summary>
        Please wait while you are logging in with twitter
      </Summary>
    </main>
  );
};

export default TwitterRedirect;
