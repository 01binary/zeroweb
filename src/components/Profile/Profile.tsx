/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  User profile.
|----------------------------------------------------------
|  Copyright(C) 2022 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import { Reaction } from '../../types/AllCommentsQuery';
import useProfile from '../../hooks/useProfile';
import Title from '../../components/Title';
import Alert from '../../components/Alert';
import PostDetailsQuery from '../../types/PostQuery';
import ProfileReaction from './ProfileReaction';
import ProfileBlurbs from './ProfileBlurbs';
import {
  getReactionIcon,
  mapReactionCollection,
  mapReactionDisplayType,
  filterDisplayableAndMatchingSearch,
  sortByDateTimeDescending,
} from './profileUtils';
import {
  BlockLinkButton,
  ProfileAvatar,
  ProfileError,
  ProfileGroup,
  ProfileHeader,
  ProfileHeading,
  ProfileName,
  ProfilePage,
  ProfileSection,
  ProfileStatus,
  ProfileTile,
  ProfileTileBorder,
  ReactionBadge,
  ReactionFilterButton,
  ReactionList,
  SecondaryText,
} from './Profile.styles';
import LinkButton from '../LinkButton';

// Max reactions to show until user clicks show more
const MAX_ITEMS = 5;

const Profile: FC<{ pages: PostDetailsQuery[] }> = ({ pages }) => {
  const {
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
    setMore,
    showMore,
  } = useProfile();

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
          <ProfileAvatar avatarUrl={avatarUrl} />
          <ProfileName>{userName}</ProfileName>
        </ProfileHeader>
      )}
      {hasDetails && (
        <ProfileSection>
          <ProfileBlurbs
            {...{
              profile,
              isSaving,
              isForAnotherUser,
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
            }}
          />

          <ProfileGroup horizontal>
            {reactionSummary && (
              <ProfileTile>
                <ProfileTileBorder />
                <ProfileHeading>reactions</ProfileHeading>

                {reactionCount == 0 && <SecondaryText>none</SecondaryText>}

                {(Object.keys(reactionSummary) as Reaction[])
                  .filter((r) => reactionSummary[r])
                  .map((emoji) => {
                    const ReactionFilterIcon = getReactionIcon(emoji);
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

            {(profile?.voteCount ?? 0) >= 0 && (
              <ProfileTile>
                <ProfileTileBorder />
                <ProfileHeading>Voted</ProfileHeading>
                {profile?.voteCount === 0 ? (
                  <SecondaryText>never</SecondaryText>
                ) : (
                  <>
                    {profile?.voteCount} <SecondaryText>times</SecondaryText>
                  </>
                )}
              </ProfileTile>
            )}
          </ProfileGroup>

          {(profile?.reactions?.length ?? 0) > 0 && (
            <ReactionList>
              {profile?.reactions
                .map(mapReactionDisplayType)
                .filter(filterDisplayableAndMatchingSearch(reactionFilter))
                .map(mapReactionCollection(pages))
                .sort(sortByDateTimeDescending)
                .slice(0, more ? undefined : MAX_ITEMS)
                .map((reaction) => (
                  <ProfileReaction key={reaction.timestamp} {...reaction} />
                ))}
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
