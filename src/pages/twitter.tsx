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
import styled from 'styled-components';
import { useBlogContext } from '../hooks/useBlogContext';
import { twitterReturn } from '../auth/twitter';
import Title from '../components/Title';
import Summary from '../components/Summary';

const Error = styled.span`
  color: ${props => props.theme.errorColor};
`;

const TwitterRedirect: FC = () => {
  const [ once, setOnce ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>(null);
  const { setUser } = useBlogContext();

  useEffect(() => {
    if (once) return;
    twitterReturn(setUser, setError);
    setOnce(true);
  }, [ twitterReturn, setUser, setError, setOnce, once ]);

  return (
    <main>
      <Title collection="about">
        {error ? 'Twitter Login Failed' : 'Logging you in with Twitter'}
      </Title>
      <Summary>
        {error
          ? <Error>{error}</Error>
          : <span>Please wait while you are logging in with twitter</span>
        }
      </Summary>
    </main>
  );
};

export default TwitterRedirect;
