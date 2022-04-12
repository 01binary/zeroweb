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

import gql from 'graphql-tag';
import { parse } from 'query-string';
import { graphql, Link } from 'gatsby';
import styled from 'styled-components';
import { FetchResult, useMutation, useQuery } from '@apollo/client';
import React, { FC, useCallback, useRef, useState } from 'react';
import { useLocation } from '@reach/router';
import { useBlogData } from '../hooks/useBlogData';
import { formatCommentDate, getCommentId } from '../utils';
import UserProfileQuery from '../types/UserProfileQuery';
import EditProfileMutation from '../types/EditProfileMutation';
import { CommentQuery, Reaction } from '../types/AllCommentsQuery';
import Title from '../components/Title';
import Alert from '../components/Alert';
import Error from '../components/Error';
import MetaLink from '../components/MetaLink';
import CommentIcon from '../images/reaction-comment.svg';
import HighlightIcon from '../images/reaction-highlight.svg';
import ReactionLolIcon from '../images/reaction-lol.svg';
import ReactionPartyIcon from '../images/reaction-party.svg';
import ReactionSnapIcon from '../images/reaction-snap.svg';
import ReactionWowIcon from '../images/reaction-wow.svg';
import ReactionConfusedIcon from '../images/reaction-confused.svg';
import ReactionGenericIcon from '../images/reaction.svg';
import SaveIcon from '../images/accept.svg';
import CancelIcon from '../images/cancel.svg';
import LocationIcon from '../images/location.svg';
import BlurbIcon from '../images/blurb.svg';
import Frame from '../images/frame.svg';
import { MOBILE, MOBILE_MIN } from '../constants';
import Avatar from '../components/Avatar';

type GenericReactionType =
  | 'CommentReaction'
  | 'PostReaction'
  | 'CommentReply'
  | 'ParagraphComment'
  | 'PostComment'
  | 'ParagraphHighlight';

// Refresh user-created content every 30 minutes
const USER_CONTENT_POLL_INTERVAL_MS = 30 * 60 * 1000;

// Max reactions to show
const MAX_ITEMS = 5;

// User profile query
const GET_PROFILE = gql`
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

const EDIT_PROFILE = gql`
  mutation($profile: EditProfileInput!) {
    editProfile(profile: $profile) {
      userId
      bio
      locationName
    }
  }
`;

const reactionDetail: Record<GenericReactionType, string> = {
  CommentReaction: ':reaction a comment on',
  PostReaction: ':reaction',
  CommentReply: 'replied to a comment on',
  ParagraphComment: 'commented on paragraph in',
  PostComment: 'commented on',
  ParagraphHighlight: 'highlighted a paragraph on',
};

const reactionName: Record<Reaction, string> = {
  snap: 'snapped to',
  party: 'popped a four loko to',
  lol: 'lolled about',
  wow: 'lost his diddly about',
  confused: 'yeeted to',
};

const reactionTypeIcons: Record<
  GenericReactionType,
  React.FunctionComponent
> = {
  CommentReaction: CommentIcon,
  PostReaction: ReactionGenericIcon,
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

const mapGenericReactionType = (comment: CommentQuery) => {
  const {
    parentTimestamp,
    markdown,
    rangeLength,
    paragraph,
    reaction,
  } = comment;
  let type: GenericReactionType | undefined;

  if (reaction && !markdown) {
    if (parentTimestamp) type = 'CommentReaction';
    else type = 'PostReaction';
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

const getPagePath = (collection, slug) => {
  if (collection === 'logs') {
    const [, projectPath, logPath] = slug.split('/');
    return `../projects/${projectPath}/${logPath}`;
  }

  return `../${collection}/${slug}`;
};

const ProfilePage = styled.main`
  margin-bottom: calc(${(props) => props.theme.spacing} * 4);
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

const ProfileRow = styled.section`
  display: flex;
  align-items: center;
`;

const ProfileStatus = styled(ProfileSection)`
  margin-bottom: ${(props) => props.theme.spacing};
`;

const ProfileHeader = styled(ProfileSection)`
  display: flex;
  align-items: center;
`;

const ProfileName = styled.span`
  font-size: ${(props) => props.theme.headingFontSizeMedium};
  margin-left: ${(props) => props.theme.spacingHalf};
`;

const ProfileGroup = styled.section<{ horizontal: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${(props) =>
    props.horizontal ? 'flex-direction:row' : 'flex-direction:column'};
`;

const ProfileTile = styled.section`
  position: relative;
  padding: ${(props) => props.theme.spacingHalf}
    ${(props) => props.theme.spacing};
  margin: ${(props) => props.theme.spacingHalf};
  margin-top: 0;
  margin-left: 0;

  &:last-of-type {
    margin-right: 0;
  }
`;

const ProfileTileBorder = styled(Frame)`
  position: absolute;
  left: 0;
  top: 0;
`;

const ProfileHeading = styled.h2`
  font-size: ${(props) => props.theme.headingFontSizeMedium};
  margin: 0 0 ${(props) => props.theme.spacingHalf} 0;
`;

const ProfileBlurbs = styled.section<{ isLoading: boolean }>`
  margin: ${(props) => props.theme.spacingHalf} 0
    ${(props) => props.theme.spacing} ${(props) => props.theme.spacingQuarter};

  ${(props) => props.isLoading && `opacity: .7`};
  transition: opacity ${(props) => props.theme.animationFast} ease-out;
`;

const ProfileBlurb = styled.section<{ deEmphasize: boolean }>`
  display: inline-block;
  ${(props) => props.deEmphasize && `color: ${props.theme.secondaryTextColor}`};
  line-height: ${(props) => props.theme.normalFontLineHight};
  padding: 8px;
  margin-right: ${(props) => props.theme.spacingQuarter};
`;

const ProfileInput = styled.input`
  font-family: ${(props) => props.theme.normalFont};
  font-size: ${(props) => props.theme.normalFontSize};
  font-weight: ${(props) => props.theme.normalFontWeight};

  min-width: calc(${MOBILE_MIN});
  margin: calc(0px - ${(props) => props.theme.border} / 2)
    ${(props) => props.theme.spacingHalf} 0
    calc(0px - ${(props) => props.theme.border});
  padding: 8px;

  border: ${(props) => props.theme.border} solid
    ${(props) => props.theme.borderColor};
  background: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.foregroundColor};

  &:focus {
    outline: none;
    border: ${(props) => props.theme.border} solid
      ${(props) => props.theme.backgroundColor};
    box-shadow: 0 0 0 ${(props) => props.theme.border}
      ${(props) => props.theme.focusColor};
  }

  @media (max-width: ${MOBILE}) {
    min-width: initial;
  }
`;

const ProfileField = styled.section`
  display: inline-block;
  height: calc(
    ${(props) => props.theme.spacing} + ${(props) => props.theme.spacingThird}
  );

  @media (max-width: ${MOBILE}) {
    height: initial;
  }
`;

const ReactionList = styled.section`
  margin-top: ${(props) => props.theme.spacingHalf};
  margin-bottom: ${(props) => props.theme.spacingHalf};
`;

const ReactionRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacingQuarter};
`;

const ReactionTypeIcon = styled.div`
  margin-right: ${(props) => props.theme.spacingHalf};
`;

const ReactionFilterButton = styled.button`
  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};
  color: ${(props) => props.theme.secondaryTextColor};

  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
`;

const ReactionBadge = styled.span`
  font-family: ${(props) => props.theme.smallFont};
  font-weight: ${(props) => props.theme.smallFontWeight};
  font-size: ${(props) => props.theme.smallFontSize};
  margin-left: ${(props) => props.theme.spacingQuarter};
`;

const ReactionDescription = styled.div`
  flex: 1 1;
`;

const SecondaryText = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;

const ReactionDate = styled.div`
  margin-left: ${(props) => props.theme.spacing};
  min-width: 6em;
`;

const StaticDate = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;

const LinkButton = styled.button`
  font-family: ${(props) => props.theme.normalFont};
  font-weight: ${(props) => props.theme.normalFontWeight};
  font-size: ${(props) => props.theme.normalFontSize};

  padding: ${(props) => props.theme.spacingQuarter};

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

const InlineLinkButton = styled(LinkButton)`
  display: inline-block;

  [disabled] {
    opacity: 0.5;
  }
`;

const ImageLinkButton = styled.button`
  border: none;
  cursor: pointer;
  fill: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;

  width: 32px;
  height: 32px;

  svg {
    pointer-events: none;
  }

  &:hover {
    .stroke-foreground {
      stroke: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }

    .fill-foreground {
      fill: ${(props) =>
        props.theme.isDark
          ? props.theme.primaryColor
          : props.theme.primaryDarkColor};
    }
  }
`;

const BlockLinkButton = styled(LinkButton)`
  margin-left: ${(props) => props.theme.spacing};
  margin-top: ${(props) => props.theme.spacingHalf};
`;

const StyledBlurbIcon = styled(BlurbIcon)`
  margin-top: calc(0px - ${(props) => props.theme.border});
`;

const StyledLocationIcon = styled(LocationIcon)`
  margin-top: calc(0px - ${(props) => props.theme.border} * 2);
`;

type ProfileQuery = {
  data: {
    allMdx: {
      nodes: [
        {
          slug: string;
          fields: {
            collection: string;
          };
        }
      ];
    };
  };
};

const Profile: FC<ProfileQuery> = ({
  data: {
    allMdx: { nodes },
  },
}) => {
  const { credentials, user } = useBlogData();
  const location = useLocation();
  const [editingBio, setEditingBio] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<boolean>(false);
  const [bioText, setBioText] = useState<string | undefined>();
  const [locationText, setLocationText] = useState<string | undefined>();
  const [reactionFilter, setReactionFilter] = useState<Reaction | null>(null);
  const [more, setMore] = useState<boolean>(false);
  const editBioRef = useRef<HTMLInputElement | null>(null);
  const editLocationRef = useRef<HTMLInputElement | null>(null);
  const search = parse(location.search);
  const userId = search.user ?? credentials?.userId;
  const isLoggedIn = Boolean(user);
  const isForAnotherUser = Boolean(search.user);

  const { loading, error, data, refetch } = useQuery<UserProfileQuery>(
    GET_PROFILE,
    {
      variables: { userId },
      pollInterval: USER_CONTENT_POLL_INTERVAL_MS,
      skip: !Boolean(isLoggedIn || isForAnotherUser),
    }
  );

  const [
    editProfile,
    { loading: isSaving, error: editError },
  ] = useMutation<EditProfileMutation>(EDIT_PROFILE);

  const profile = data?.profile;
  const userName = isForAnotherUser ? profile?.userName : user?.name;
  const avatarUrl = isForAnotherUser ? profile?.avatarUrl : user?.avatarUrl;
  const hasHeader = Boolean(userName || avatarUrl);
  const hasDetails = Boolean(profile);
  const notLoggedIn = !isLoggedIn && !isForAnotherUser;
  const showMore = data?.profile?.reactions?.length > 5;
  const formattedLastActivity = profile?.lastActivity
    ? formatCommentDate(profile.lastActivity).split(' ')
    : [];

  const reactionSummary: Record<Reaction, number> = profile?.reactions
    ?.filter(({ reaction }) => reaction)
    ?.reduce(
      (sum, { reaction: emoji }) => ({
        ...sum,
        [emoji]: sum[emoji] + 1,
      }),
      { snap: 0, party: 0, wow: 0, lol: 0, confused: 0 }
    );

  const reactionCount = reactionSummary
    ? Object.keys(reactionSummary).reduce(
        (count, emoji) => count + reactionSummary[emoji],
        0
      )
    : 0;

  const saveProfile = useCallback((): Promise<FetchResult> => {
    if (!credentials?.userId) return Promise.reject('not logged in');
    const updatedProfile = {
      bio: bioText ?? profile?.bio,
      locationName: locationText ?? profile?.locationName,
    };
    return editProfile({
      variables: {
        profile: updatedProfile,
      },
      update(cache, { data: updatedProfile }) {
        if (!credentials?.userId) return;
        cache.writeQuery({
          query: GET_PROFILE,
          variables: { userId: credentials.userId },
          data: {
            profile: {
              ...profile,
              updatedProfile,
            },
          },
        });
        refetch();
      },
    });
  }, [profile, bioText, locationText, editProfile]);

  const handleEditBio = useCallback(
    (isEditing: boolean, isSaving: boolean = false) => {
      if (isSaving) saveProfile();
      setBioText(isEditing ? profile?.bio ?? '' : undefined);
      setEditingBio(isEditing);
      setEditingLocation(false);
      setLocationText(undefined);
      if (isEditing)
        setTimeout(() => {
          editBioRef?.current?.select();
          editBioRef?.current?.focus();
        });
    },
    [
      profile,
      saveProfile,
      setBioText,
      setLocationText,
      setEditingBio,
      setEditingLocation,
    ]
  );

  const handleEditLocation = useCallback(
    (isEditing: boolean, isSaving: boolean = false) => {
      if (isSaving) saveProfile();
      setLocationText(isEditing ? profile?.locationName ?? '' : undefined);
      setEditingLocation(isEditing);
      setEditingBio(false);
      setBioText(undefined);
      if (isEditing)
        setTimeout(() => {
          editLocationRef?.current?.select();
          editLocationRef?.current?.focus();
        });
    },
    [
      profile,
      saveProfile,
      setLocationText,
      setBioText,
      setEditingBio,
      setEditingLocation,
    ]
  );

  return (
    <ProfilePage>
      <Title collection="about">
        {isForAnotherUser ? 'Profile' : 'Your Profile'}
      </Title>
      {!credentials && <ProfileStatus>loading account...</ProfileStatus>}
      {loading && <ProfileStatus>loading profile...</ProfileStatus>}
      {credentials && notLoggedIn && (
        <ProfileSection>you are not logged in</ProfileSection>
      )}
      {hasHeader && (
        <ProfileHeader>
          <Avatar avatarUrl={avatarUrl} />
          <ProfileName>{userName}</ProfileName>
        </ProfileHeader>
      )}
      {hasDetails && (
        <ProfileSection>
          <ProfileBlurbs isLoading={isSaving}>
            <ProfileRow>
              <StyledBlurbIcon />
              <ProfileField>
                {editingBio ? (
                  <ProfileInput
                    type="text"
                    placeholder="bio"
                    ref={editBioRef}
                    value={bioText ?? ''}
                    onChange={(e) => setBioText(e.target.value)}
                  />
                ) : profile?.bio ? (
                  <ProfileBlurb>{profile.bio}</ProfileBlurb>
                ) : (
                  <ProfileBlurb deEmphasize>no bio</ProfileBlurb>
                )}
              </ProfileField>

              {editingBio ? (
                <>
                  <ImageLinkButton onClick={() => handleEditBio(false, true)}>
                    <SaveIcon />
                  </ImageLinkButton>
                  <ImageLinkButton onClick={() => handleEditBio(false)}>
                    <CancelIcon />
                  </ImageLinkButton>
                </>
              ) : isForAnotherUser ? null : (
                <InlineLinkButton
                  disabled={isSaving}
                  onClick={() => handleEditBio(true)}
                >
                  edit
                </InlineLinkButton>
              )}
            </ProfileRow>

            <ProfileRow>
              <StyledLocationIcon />
              <ProfileField>
                {editingLocation ? (
                  <ProfileInput
                    type="text"
                    placeholder="location"
                    ref={editLocationRef}
                    value={locationText ?? ''}
                    onChange={(e) => setLocationText(e.target.value)}
                  />
                ) : profile?.locationName ? (
                  <ProfileBlurb deEmphasize>
                    {profile.locationName}
                  </ProfileBlurb>
                ) : (
                  <ProfileBlurb deEmphasize>no location</ProfileBlurb>
                )}
              </ProfileField>

              {editingLocation ? (
                <>
                  <ImageLinkButton
                    onClick={() => handleEditLocation(false, true)}
                  >
                    <SaveIcon />
                  </ImageLinkButton>
                  <ImageLinkButton onClick={() => handleEditLocation(false)}>
                    <CancelIcon />
                  </ImageLinkButton>
                </>
              ) : isForAnotherUser ? null : (
                <InlineLinkButton
                  disabled={isSaving}
                  onClick={() => handleEditLocation(true)}
                >
                  edit
                </InlineLinkButton>
              )}
            </ProfileRow>
          </ProfileBlurbs>

          <ProfileGroup horizontal>
            {reactionSummary && (
              <ProfileTile>
                <ProfileTileBorder />
                <ProfileHeading>reactions</ProfileHeading>

                {reactionCount == 0 && <SecondaryText>none</SecondaryText>}

                {Object.keys(reactionSummary)
                  .filter((r) => reactionSummary[r])
                  .map((emoji) => {
                    const ReactionFilterIcon = reactionIcons[emoji];
                    return (
                      <ReactionFilterButton
                        key={emoji}
                        onClick={() => setReactionFilter(emoji as Reaction)}
                      >
                        <ReactionFilterIcon />
                        <ReactionBadge>{reactionSummary[emoji]}</ReactionBadge>
                      </ReactionFilterButton>
                    );
                  })}
                {reactionFilter && (
                  <>
                    {' / '}
                    <LinkButton onClick={() => setReactionFilter(null)}>
                      clear filter
                    </LinkButton>
                  </>
                )}
              </ProfileTile>
            )}

            {profile?.lastActivity && (
              <ProfileTile>
                <ProfileTileBorder />
                <ProfileHeading>last reaction</ProfileHeading>
                {formattedLastActivity[0]}{' '}
                <SecondaryText>
                  {formattedLastActivity.slice(1).join(' ')}
                </SecondaryText>
              </ProfileTile>
            )}

            {profile?.voteCount >= 0 && (
              <ProfileTile>
                <ProfileTileBorder />
                <ProfileHeading>Voted</ProfileHeading>
                {profile.voteCount === 0 ? (
                  <SecondaryText>never</SecondaryText>
                ) : (
                  <>
                    {profile.voteCount} <SecondaryText>times</SecondaryText>
                  </>
                )}
              </ProfileTile>
            )}
          </ProfileGroup>

          {profile?.reactions?.length > 0 && (
            <ReactionList>
              {profile.reactions
                .map(mapGenericReactionType)
                .filter(
                  // Displayable and not filtered if filter is on
                  ({ type, reaction }) =>
                    type && (!reactionFilter || reactionFilter === reaction)
                )
                .sort(
                  // Descending by date time
                  ({ timestamp: t1 }, { timestamp: t2 }) =>
                    new Date(t2).valueOf() - new Date(t1).valueOf()
                )
                .slice(0, more ? undefined : MAX_ITEMS)
                .map((reaction) => {
                  const { slug, timestamp, reaction: emoji, type } = reaction;
                  const reactionDate = formatCommentDate(timestamp);
                  const GenericIcon = reactionTypeIcons[type];
                  const Icon = emoji ? reactionIcons[emoji] : GenericIcon;
                  const detail = reactionDetail[type].replace(
                    ':reaction',
                    reactionName[emoji] ?? ''
                  );
                  const textPrimary = detail.split(' ')[0];
                  const textSecondary = detail.substring(
                    textPrimary.length + 1
                  );
                  const collection = nodes.find(
                    ({ slug: nodeSlug }) => nodeSlug === slug
                  )?.fields?.collection;
                  const postLink = getPagePath(collection, slug);
                  const commentLink =
                    type === 'PostComment' ||
                    type === 'ParagraphComment' ||
                    type === 'CommentReply'
                      ? `${postLink}?comment=${getCommentId(timestamp)}`
                      : null;

                  return (
                    <ReactionRow key={timestamp}>
                      <ReactionTypeIcon>
                        <Icon />
                      </ReactionTypeIcon>
                      <ReactionDescription>
                        {textPrimary}{' '}
                        <SecondaryText>{textSecondary}</SecondaryText>{' '}
                        <Link to={postLink}>{slug}</Link>
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
                <BlockLinkButton onClick={() => setMore(true)}>
                  see more...
                </BlockLinkButton>
              )}
            </ReactionList>
          )}
        </ProfileSection>
      )}
      {error && (
        <Alert fullWidth>
          <ProfileError>error loading profile</ProfileError>
        </Alert>
      )}
      {editError && (
        <Alert fullWidth>
          <ProfileError>error saving profile</ProfileError>
        </Alert>
      )}
    </ProfilePage>
  );
};

export default Profile;

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
