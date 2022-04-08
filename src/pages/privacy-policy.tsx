/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Privacy Policy page.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import styled from 'styled-components';
import Title from '../components/Title';
import { List } from '../components/Post/UnorderedList';
import PrivacyPolicyIcon from '../images/privacy.svg';

const Policy = styled.section`
  margin-right: ${(props) => props.theme.spacingHalf};

  opacity: 0;
  animation: slideIn ${(props) => props.theme.animationSlow} 0.2s ease-out 1;
  animation-fill-mode: forwards;

  // Flickers on Safari due to opacity
  transform-style: preserve-3d;
  backface-visibility: hidden;

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: translateY(8px);
    }

    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

const PolicyHeader = styled.section`
  display: flex;
  align-items: center;
  margin-left: ${(props) => props.theme.spacingHalf};
`;

const StyledPolicyIcon = styled(PrivacyPolicyIcon)`
  margin-right: ${(props) => props.theme.spacingHalf};
`;

const PrivacyPolicy: FC = () => (
  <main>
    <Title collection="about">Privacy Policy</Title>
    <Policy>
      <PolicyHeader>
        <StyledPolicyIcon />
        Hi there!
      </PolicyHeader>
      <p>
        On this site I collect only the minimum information used to display
        social content.
      </p>
      <List>
        <li>
          <strong>User ID</strong> from your social provider like Facebook (a
          number that doesn't contain your name or email) is associated with
          your account on this site when you log in
        </li>
        <li>
          <strong>User Name</strong> that appears next to your comments and
          reactions on this site is copied from the name you use on your social
          account
        </li>
        <li>
          <strong>Avatar URL</strong> is used to display your avatar next to
          your comments on this site. This is recorded only when you post at
          least one comment
        </li>
      </List>
      <p>
        You can delete your comments any time by clicking the ellipsis ("...")
        button that appears when you hover over one of your own comments while
        logged in and select Delete. On mobile views this button is always
        displayed.
      </p>
      <p>
        There is not currently a way for you to delete your own reactions
        (emojis) on comments made by others, or to delete your own social login
        from the site. Please contact{' '}
        <a href="mailto:01binaryproductions@gmail.com">
          01binaryproductions <em>at</em> gmail.com
        </a>{' '}
        to get all records containing your information erased.
      </p>
      <p>I do not collect the following without your permission:</p>
      <List>
        <li>
          <strong>Email</strong> - I ask for this specifically when you click
          Subscribe to receive regular updates about new content on the site
        </li>
        <li>
          <strong>Your location or any other personal information</strong>. You
          can edit location and bio in your profile at any time but these fields
          are never set automatically.
        </li>
      </List>
    </Policy>
  </main>
);

export default PrivacyPolicy;
