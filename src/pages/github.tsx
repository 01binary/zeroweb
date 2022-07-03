/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Github sign-in redirect page.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC, useEffect, useState } from 'react';
import { Link, navigate } from 'gatsby';
import styled from 'styled-components';
import { useBlogContext } from '../hooks/useBlogContext';
import useGithub from '../auth/useGithub';
import Title from '../components/Title';
import Summary from '../components/Summary';

const Error = styled.span`
  color: ${(props) => props.theme.errorColor};
`;

const BackLink = styled(Link)`
  display: block;
  margin-top: ${(props) => props.theme.spacing};
`;

const GithubRedirect: FC = () => {
  const [once, setOnce] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [returnUrl, setReturnUrl] = useState<string>('/');
  const { setUser, setCredentials } = useBlogContext();
  const { gitHubReturn } = useGithub(setUser, setCredentials, setError);

  useEffect(() => {
    if (once) return;
    gitHubReturn(setReturnUrl, (to) => navigate(to));
    setOnce(true);
  }, [gitHubReturn, setOnce, navigate, once]);

  return (
    <main>
      <Title collection="about">
        {error ? 'GitHub Login Failed' : 'Logging you in with GitHub'}
      </Title>
      <Summary>
        {error ? (
          <>
            <Error>{error}</Error>
            <BackLink to={returnUrl}>← Go back</BackLink>
          </>
        ) : (
          <>
            <span>Please wait while logging you in with GitHub...</span>
          </>
        )}
      </Summary>
    </main>
  );
};

export default GithubRedirect;
