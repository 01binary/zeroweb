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

import React, { FC, useState } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { useLocation } from '@reach/router';
import { parse } from 'query-string';
import { useBlogData } from '../hooks/useBlogData';
import Title from '../components/Title';
import { useQuery } from '@apollo/client';
import UserProfileQuery from '../types/UserProfileQuery';
import gql from 'graphql-tag';
import { formatCommentDate, getCommentId } from '../utils';
import Alert from '../components/Alert';
import Error from '../components/Error';
import { CommentQuery, Reaction } from '../types/AllCommentsQuery';
import MetaLink from '../components/MetaLink';
import CommentIcon from '../images/reaction-comment.svg';
import HighlightIcon from '../images/reaction-highlight.svg';
import ReactionLolIcon from '../images/reaction-lol.svg';
import ReactionPartyIcon from '../images/reaction-party.svg';
import ReactionSnapIcon from '../images/reaction-snap.svg';
import ReactionWowIcon from '../images/reaction-wow.svg';
import ReactionConfusedIcon from '../images/reaction-confused.svg';
import ReactionGenericIcon from '../images/reaction.svg';
import LocationIcon from '../images/location.svg';

type ReactionType =
  | 'CommentReaction'
  | 'PostReaction'
  | 'CommentReply'
  | 'ParagraphComment'
  | 'PostComment'
  | 'ParagraphHighlight';

const reactionText: Record<ReactionType, string> = {
  CommentReaction: 'reacted to a comment on',
  PostReaction: 'reacted to',
  CommentReply: 'replied to a comment on',
  ParagraphComment: 'commented on paragraph in',
  PostComment: 'commented on',
  ParagraphHighlight: 'highlighted a paragraph on',
};

const reactionTypeIcons: Record<ReactionType, React.FunctionComponent> = {
  CommentReaction: CommentIcon,
  PostReaction: ReactionGenericIcon,
  // TODO: the two-comment icon
  CommentReply: CommentIcon,
  ParagraphComment: CommentIcon,
  PostComment: CommentIcon,
  ParagraphHighlight: HighlightIcon,
};

const reactionIcons: Record<Reaction, React.FunctionComponent> = {
  snap: ReactionSnapIcon,
  party: ReactionPartyIcon,
  lol: ReactionLolIcon,
  wow: ReactionWowIcon,
  confused: ReactionConfusedIcon,
};

// Refresh user-created content every 30 minutes
const USER_CONTENT_POLL_INTERVAL_MS = 30 * 60 * 1000;

// With of user avatar on this page
const AVATAR_WIDTH = 38;

// Max reactions to show
const MAX_ITEMS = 5;

const USER_PROFILE = gql`
  query userProfile($userId: String!) {
    profile(userId: $userId) {
      userName
      avatarUrl
      bio
      locationName
      lastActivity
      reactions {
        slug
        timestamp
        parentTimestamp
        markdown
        rangeLength
        reaction
        paragraph
      }
      voteCount
    }
  }
`;

const reactionType = (comment: CommentQuery) => {
  const {
    parentTimestamp,
    markdown,
    rangeLength,
    paragraph,
    reaction,
  } = comment;
  let type: ReactionType | undefined;

  if (reaction && !markdown) {
    if (parentTimestamp) {
      type = 'CommentReaction';
    } else {
      type = 'PostReaction';
    }
  } else if (markdown) {
    if (parentTimestamp) {
      type = 'CommentReply';
    } else {
      if (paragraph) type = 'ParagraphComment';
      else type = 'PostComment';
    }
  } else if (rangeLength) {
    type = 'ParagraphHighlight';
  }

  return {
    ...comment,
    type,
  };
};

const ProfilePage = styled.main`
  margin-bottom: ${(props) => props.theme.spacing};
`;

const ProfileError = styled(Error)`
  margin: ${(props) => props.theme.spacingHalf};
`;

const ProfileSection = styled.section`
  margin-left: ${(props) => props.theme.spacingHalf};
  margin-right: ${(props) => props.theme.spacingHalf};

  animation: slideIn ${(props) => props.theme.animationSlow} ease-out 1;

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

const ProfileHeader = styled(ProfileSection)`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacingHalf};
`;

const UserName = styled.span`
  font-size: ${(props) => props.theme.headingFontSizeMedium};
  margin-left: ${(props) => props.theme.spacingHalf};
`;

const ProfileDetails = styled(ProfileSection)``;

const ProfileRow = styled.section<{ horizontal: boolean }>`
  display: flex;
  ${(props) =>
    props.horizontal ? 'flex-direction:row' : 'flex-direction:column'};
`;

const ProfileTile = styled.section`
  border: 1px solid gray;

  padding: ${(props) => props.theme.spacingHalf};
  margin: ${(props) => props.theme.spacingHalf};
  margin-top: 0;
  margin-left: 0;

  &:last-of-type {
    margin-right: 0;
  }
`;

const ProfileHeading = styled.h2`
  font-size: ${(props) => props.theme.headingFontSizeMedium};
  margin: 0 0 ${(props) => props.theme.spacingHalf} 0;
`;

const ProfileBlurbs = styled.section`
  margin: ${(props) => props.theme.spacingHalf} 0
    ${(props) => props.theme.spacing} 0;
`;

const ProfileBlurb = styled.section<{ deEmphasize: boolean }>`
  ${(props) => props.deEmphasize && `color: ${props.theme.secondaryTextColor}`};
  margin-bottom: ${(props) => props.theme.spacingHalf};
`;

const UserAvatar = ({ avatarUrl }) => (
  <svg width="38" height="44" viewBox="0 0 38 44">
    <defs>
      <clipPath id="avatar-clip">
        <polygon points="0.5,11.3 0.5,32.7 19,43.3 37.5,32.7 37.5,11.3 19,0.6" />
      </clipPath>
    </defs>
    <polygon
      className="stroke-border fill-opaque"
      points="0.5,11.3 0.5,32.7 19,43.3 37.5,32.7 37.5,11.3 19,0.6"
    />
    <image
      clipPath="url(#avatar-clip)"
      x="-2"
      y="1"
      width={`${AVATAR_WIDTH + 4}px`}
      height={`${AVATAR_WIDTH + 4}px`}
      xlinkHref={avatarUrl}
    />
  </svg>
);

const ReactionList = styled.section`
  margin-top: ${(props) => props.theme.spacingHalf};
`;

const ReactionRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacingQuarter};
`;

const ReactionType = styled.div`
  margin-right: ${(props) => props.theme.spacingHalf};

  svg {
    path {
      stroke-width: 1 !important;
    }
  }
`;

const ReactionDescription = styled.div`
  flex: 1 1;
`;

const ReactionDate = styled.div`
  min-width: 7em;
`;

const StaticDate = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;

const MoreButton = styled.button`
  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  transition: color ${(props) => props.theme.animationFast} ease-out;

  color: ${(props) =>
    props.theme.isDark
      ? props.theme.primaryColor
      : props.theme.accentTextColor};

  &:focus {
    border-radius: ${(props) => props.theme.borderRadius};
    box-shadow: 0 0 0 ${(props) => props.theme.border}
      ${(props) => props.theme.focusColor};
    outline: none;
  }

  &:hover {
    text-decoration: underline;
    color: ${(props) =>
      props.theme.isDark
        ? props.theme.primaryLightColor
        : props.theme.primaryDarkColor};
  }
`;

const StyledLocationIcon = styled(LocationIcon)``;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
`;

const Profile: FC = () => {
  const { credentials, user } = useBlogData();
  const location = useLocation();
  const [more, setMore] = useState<boolean>(false);
  const search = parse(location.search);
  const userId = search.user ?? credentials?.userId;
  const isLoggedIn = Boolean(user);
  const isForAnotherUser = Boolean(search.user);

  const { loading, error, data } = useQuery<UserProfileQuery>(USER_PROFILE, {
    variables: { userId },
    pollInterval: USER_CONTENT_POLL_INTERVAL_MS,
    skip: !Boolean(isLoggedIn || isForAnotherUser),
  });

  const profile = data?.profile;
  const userName = isForAnotherUser ? profile?.userName : user?.name;
  const avatarUrl = isForAnotherUser ? profile?.avatarUrl : user?.avatarUrl;
  const hasHeader = Boolean(userName || avatarUrl);
  const hasDetails = Boolean(profile);
  const notLoggedIn = !isLoggedIn && !isForAnotherUser;
  const showMore = data?.profile?.reactions?.length > 5;

  return (
    <ProfilePage>
      <Title collection="about">
        {isForAnotherUser ? 'Profile' : 'Your Profile'}
      </Title>
      {loading && <ProfileSection>loading profile...</ProfileSection>}
      {notLoggedIn && <ProfileSection>you are not logged in</ProfileSection>}
      {hasHeader && (
        <ProfileHeader>
          <UserAvatar avatarUrl={avatarUrl} />
          <UserName>{userName}</UserName>
        </ProfileHeader>
      )}
      {hasDetails && (
        <ProfileDetails>
          <ProfileBlurbs>
            {profile?.bio && <ProfileBlurb>{profile.bio}</ProfileBlurb>}
            {profile?.locationName && (
              <ProfileBlurb deEmphasize>
                <LocationRow>
                  <StyledLocationIcon />
                  {profile.locationName}
                </LocationRow>
              </ProfileBlurb>
            )}
          </ProfileBlurbs>

          <ProfileRow horizontal>
            {profile?.lastActivity && (
              <ProfileTile>
                <ProfileHeading>Last reaction</ProfileHeading>
                {formatCommentDate(profile.lastActivity)}
              </ProfileTile>
            )}

            {profile?.voteCount >= 0 && (
              <ProfileTile>
                <ProfileHeading>Votes</ProfileHeading>
                {profile.voteCount}
              </ProfileTile>
            )}
          </ProfileRow>

          {profile?.reactions?.length > 0 && (
            <ReactionList>
              {profile.reactions
                .map(reactionType)
                .filter(({ type }) => type)
                .slice(0, more ? undefined : MAX_ITEMS)
                .map((reaction) => {
                  const { slug, timestamp, reaction: emoji, type } = reaction;
                  const reactionDate = formatCommentDate(timestamp);
                  const GenericIcon = reactionTypeIcons[type];
                  const Icon = emoji ? reactionIcons[emoji] : GenericIcon;
                  const postLink = `/articles/${slug}`;
                  const commentLink =
                    type === 'PostComment' ||
                    type === 'ParagraphComment' ||
                    type === 'CommentReply'
                      ? `${postLink}?comment=${getCommentId(timestamp)}`
                      : null;

                  return (
                    <ReactionRow key={timestamp}>
                      <ReactionType>
                        <Icon />
                      </ReactionType>
                      <ReactionDescription>
                        {reactionText[type]} <Link to={postLink}>{slug}</Link>
                      </ReactionDescription>
                      <ReactionDate>
                        {commentLink ? (
                          <MetaLink to={commentLink}>{reactionDate}</MetaLink>
                        ) : (
                          <StaticDate>{reactionDate}</StaticDate>
                        )}
                      </ReactionDate>
                    </ReactionRow>
                  );
                })}
              {showMore && !more && (
                <MoreButton onClick={() => setMore(true)}>
                  See more...
                </MoreButton>
              )}
            </ReactionList>
          )}
        </ProfileDetails>
      )}
      {error && (
        <Alert fullWidth>
          <ProfileError>Error loading profile</ProfileError>
        </Alert>
      )}
    </ProfilePage>
  );
};

export default Profile;
