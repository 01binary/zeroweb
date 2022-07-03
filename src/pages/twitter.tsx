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
import useTwitter from '../auth/useTwitter';
import Title from '../components/Title';
import Summary from '../components/Summary';

const Error = styled.span`
  color: ${(props) => props.theme.errorColor};
`;

const BackLink = styled(Link)`
  display: block;
  margin-top: ${(props) => props.theme.spacing};
`;

const TwitterRedirect: FC = () => {
  const [once, setOnce] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [returnUrl, setReturnUrl] = useState<string>('/');
  const { setUser, setCredentials } = useBlogContext();
  const { twitterReturn } = useTwitter(setUser, setCredentials, setError);

  useEffect(() => {
    if (once) return;
    twitterReturn(setReturnUrl, (to) => navigate(to));
    setOnce(true);
  }, [twitterReturn, setOnce, navigate, once]);

  return (
    <main>
      <Title collection="about">
        {error ? 'Twitter Login Failed' : 'Logging you in with Twitter'}
      </Title>
      <Summary>
        {error ? (
          <>
            <Error>{error}</Error>
            <BackLink to={returnUrl}>← Go back</BackLink>
          </>
        ) : (
          <>
            <span>Please wait while logging you in with Twitter...</span>
          </>
        )}
      </Summary>
    </main>
  );
};

export default TwitterRedirect;
