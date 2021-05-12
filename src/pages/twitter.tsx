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
import { Link, navigate } from 'gatsby';
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
  const [ returnUrl, setReturnUrl ] = useState<string>('/');
  const { setUser } = useBlogContext();

  useEffect(() => {
    if (once) return;
    twitterReturn(setUser, setError, setReturnUrl, to => navigate(to));
    setOnce(true);
  }, [ twitterReturn, setUser, setError, setOnce, once ]);

  return (
    <main>
      <Title collection="about">
        {error ? 'Twitter Login Failed' : 'Logging you in with Twitter'}
      </Title>
      <Summary>
        {error
          ? (
            <section>
              <Error>{error}</Error>
              <Link to={returnUrl}>Go back</Link>
            </section>
          )
          : (
            <section>
              <span>Please wait while you are logging in with twitter...</span>
            </section>
          )
        }
      </Summary>
    </main>
  );
};

export default TwitterRedirect;
