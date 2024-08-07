import React, { FC } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Avatar from '../Avatar';
import UserProfileQuery from '../../types/UserProfileQuery';
import LocationIcon from '../../images/location.svg';
import BlurbIcon from '../../images/blurb.svg';
import { formatCommentDate } from '../../utils';

// How often to refresh user profile data in tip
const PROFILE_REFRESH_INTERVAL = 8 * 60 * 60 * 1000;

const ProfileMessage = styled.section`
  margin: ${(props) => props.theme.spacingHalf} 0
    ${(props) => props.theme.spacingQuarter}
    calc(
      ${(props) => props.theme.spacingQuarter} +
        ${(props) => props.theme.spacingOneAndHalf}
    );
`;

const ProfileInfo = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ProfileDetails = styled.section`
  margin: ${(props) => props.theme.spacingHalf} 0 0
    ${(props) => props.theme.spacingQuarter};
`;

const ProfileGroup = styled(ProfileInfo)`
  margin-bottom: ${(props) => props.theme.spacingQuarter};
`;

const ProfileText = styled.span<{ secondary: boolean }>`
  ${(props) => props.secondary && `opacity: .7`};
  margin: 0 0 0 ${(props) => props.theme.spacingHalf};
  max-width: 15em;
  white-space: pre-wrap;
  text-transform: initial;
`;

const StyledBlurbIcon = styled(BlurbIcon)`
  margin-right: ${(props) => props.theme.spacingQuarter};
`;

const StyledLocationIcon = styled(LocationIcon)`
  margin-right: ${(props) => props.theme.spacingQuarter};
`;

const GET_PROFILE = gql`
  query userProfile($userId: String!) {
    profile(userId: $userId) {
      bio
      locationName
      lastActivity
    }
  }
`;

type ProfileTipProps = {
  userId: string;
  userName: string;
  avatarUrl: string;
};

const ProfileTip: FC<ProfileTipProps> = ({ userId, userName, avatarUrl }) => {
  const { data, loading } = useQuery<UserProfileQuery>(GET_PROFILE, {
    variables: { userId },
    pollInterval: PROFILE_REFRESH_INTERVAL,
  });

  const profile = data?.profile;

  return (
    <>
      <ProfileInfo>
        <Avatar avatarUrl={avatarUrl} />
        <ProfileText>{userName}</ProfileText>
      </ProfileInfo>
      {loading && <ProfileMessage>loading...</ProfileMessage>}
      {(profile?.bio || profile?.locationName) && (
        <ProfileDetails>
          {profile.bio && (
            <ProfileGroup>
              <StyledBlurbIcon />
              <ProfileText>{profile.bio}</ProfileText>
            </ProfileGroup>
          )}
          {profile.locationName && (
            <ProfileGroup>
              <StyledLocationIcon />
              <ProfileText secondary>{profile.locationName}</ProfileText>
            </ProfileGroup>
          )}
        </ProfileDetails>
      )}
      {profile?.lastActivity && (
        <ProfileMessage>
          last active {formatCommentDate(profile.lastActivity)}
        </ProfileMessage>
      )}
    </>
  );
};

export default ProfileTip;
