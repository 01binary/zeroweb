/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  User profile interactions.
|----------------------------------------------------------
|  Copyright(C) 2022 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { useState, useCallback, useRef, useMemo } from 'react';
import gql from 'graphql-tag';
import { parse } from 'query-string';
import { useLocation } from '@reach/router';
import { Reaction } from '../types/AllCommentsQuery';
import { FetchResult, useMutation, useQuery } from '@apollo/client';
import UserProfileQuery from '../types/UserProfileQuery';
import EditProfileMutation from '../types/EditProfileMutation';
import { useBlogContext } from './useBlogContext';
import { formatCommentDate } from '../utils';

// Map all reactions to this type
export type ReactionDisplayType =
  | 'CommentReaction'
  | 'PostReaction'
  | 'CommentReply'
  | 'ParagraphComment'
  | 'PostComment'
  | 'ParagraphHighlight';

// Refresh user-created content every 30 minutes
const USER_CONTENT_POLL_INTERVAL_MS = 30 * 60 * 1000;

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

// User profile mutation
const EDIT_PROFILE = gql`
  mutation($profile: EditProfileInput!) {
    editProfile(profile: $profile) {
      userId
      bio
      locationName
    }
  }
`;

const useProfile = () => {
  const { credentials, user } = useBlogContext();
  const location = useLocation();
  const [editingBio, setEditingBio] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<boolean>(false);
  const [bioText, setBioText] = useState<string | undefined>();
  const [locationText, setLocationText] = useState<string | undefined>();
  const [reactionFilter, setReactionFilter] = useState<Reaction | null>(null);
  const [more, setMore] = useState<boolean>(false);
  const editBioRef = useRef<HTMLInputElement>();
  const editLocationRef = useRef<HTMLInputElement>();
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
  const showMore = data?.profile?.reactions?.length ?? 0 > 5;
  const formattedLastActivity = profile?.lastActivity
    ? formatCommentDate(profile.lastActivity).split(' ')
    : [];

  const reactionSummary = useMemo(
    () =>
      profile?.reactions
        ?.filter(({ reaction }) => reaction)
        ?.reduce(
          (sum, { reaction: emoji }) =>
            emoji
              ? {
                  ...sum,
                  [emoji]: sum[emoji] + 1,
                }
              : sum,
          { snap: 0, party: 0, wow: 0, lol: 0, confused: 0 } as Record<
            Reaction,
            number
          >
        ),
    [profile]
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

  return {
    error,
    loading,
    profile,
    credentials,
    isForAnotherUser,
    hasHeader,
    hasDetails,
    notLoggedIn,
    userName,
    avatarUrl,
    editError,
    editBioRef,
    editingBio,
    bioText,
    setBioText,
    handleEditBio,
    editLocationRef,
    editingLocation,
    locationText,
    setLocationText,
    handleEditLocation,
    reactionFilter,
    setReactionFilter,
    formattedLastActivity,
    reactionSummary,
    reactionCount,
    isSaving,
    more,
    showMore,
    setMore,
  };
};

export default useProfile;
