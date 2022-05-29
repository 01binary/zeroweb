/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  User profile page.
|----------------------------------------------------------
|  Copyright(C) 2022 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import { graphql } from 'gatsby';
import Profile from '../components/Profile/Profile';
import PostDetailsQuery from '../types/PostQuery';

type ProfileQuery = {
  data: {
    allMdx: {
      nodes: PostDetailsQuery[];
    };
  };
};

const ProfilePage: FC<ProfileQuery> = ({
  data: {
    allMdx: { nodes },
  },
}) => <Profile pages={nodes} />;

export default ProfilePage;

export const pageQuery = graphql`
  query {
    allMdx {
      nodes {
        slug
        fields {
          url
          collection
        }
      }
    }
  }
`;
