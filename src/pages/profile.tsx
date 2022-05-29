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
import styled from 'styled-components';
import { graphql, Link } from 'gatsby';
import { formatCommentDate, getCommentId } from '../utils';
import { CommentQuery, Reaction } from '../types/AllCommentsQuery';
import useProfile, { ReactionDisplayType } from '../hooks/useProfile';
import { MOBILE, MOBILE_MIN } from '../constants';
import Title from '../components/Title';
import Alert from '../components/Alert';
import Error from '../components/Error';
import MetaLink from '../components/MetaLink';
import SaveIcon from '../images/accept.svg';
import CancelIcon from '../images/cancel.svg';
import LocationIcon from '../images/location.svg';
import BlurbIcon from '../images/blurb.svg';
import Frame from '../images/frame.svg';
import CommentIcon from '../images/reaction-comment.svg';
import HighlightIcon from '../images/reaction-highlight.svg';
import ReactionLolIcon from '../images/reaction-lol.svg';
import ReactionPartyIcon from '../images/reaction-party.svg';
import ReactionSnapIcon from '../images/reaction-snap.svg';
import ReactionWowIcon from '../images/reaction-wow.svg';
import ReactionConfusedIcon from '../images/reaction-confused.svg';
import ReactionGenericIcon from '../images/reaction.svg';
import Avatar from '../components/Avatar';

// Max reactions to show until user clicks show more
const MAX_ITEMS = 5;

const REACTION_NAMES: Record<Reaction, string> = {
  snap: 'snapped to',
  party: 'popped a four loko to',
  lol: 'lolled about',
  wow: 'lost his diddly about',
  confused: 'yeeted to',
};

const REACTION_DETAILS: Record<ReactionDisplayType, string> = {
  CommentReaction: ':reaction a comment on',
  PostReaction: ':reaction',
  CommentReply: 'replied to a comment on',
  ParagraphComment: 'commented on paragraph in',
  PostComment: 'commented on',
  ParagraphHighlight: 'highlighted a paragraph on',
};

const REACTION_TYPE_ICONS: Record<
  ReactionDisplayType,
  React.FunctionComponent
> = {
  CommentReaction: CommentIcon,
  PostReaction: ReactionGenericIcon,
  CommentReply: CommentIcon,
  ParagraphComment: CommentIcon,
  PostComment: CommentIcon,
  ParagraphHighlight: HighlightIcon,
};

const REACTION_ICONS: Record<Reaction, React.FunctionComponent> = {
  snap: ReactionSnapIcon,
  party: ReactionPartyIcon,
  lol: ReactionLolIcon,
  wow: ReactionWowIcon,
  confused: ReactionConfusedIcon,
};

/**
 * Gets a relative page path for gatsby link
 * @param collection - The collection the page is in
 * @param slug - The page slug
 * @returns The relative path to a blog page
 */
const getPagePath = (collection, slug) => {
  if (collection === 'logs') {
    const [, projectPath, logPath] = slug.split('/');
    return `../projects/${projectPath}/${logPath}`;
  }

  return `../${collection}/${slug}`;
};

/**
 * Sort reactions by date/time in ascending order
 * @param first - The first reaction 
 * @param second - The second reaction 
 * @returns Comparison result
 */
const sortByDateTimeDescending = ({ timestamp: t1 }: CommentQuery, { timestamp: t2 }: CommentQuery) =>
  new Date(t2).valueOf() - new Date(t1).valueOf()

/**
 * Filter reactions by displayable and matching search filter
 * @param reactionFilter - The search filter
 * @returns Whether a reaction is filtered
 */
const filterDisplayableAndMatchingSearch = (reactionFilter: string | null) =>
  ({ type, reaction }: ReturnType<typeof mapReactionDisplayType>) =>
    type && (!reactionFilter || reactionFilter === reaction)

/**
 * Map a display type for a reaction
 * @param comment - The reaction to analyze
 * @returns The reaction type
 */
const mapReactionDisplayType = (comment: CommentQuery) => {
  const {
    parentTimestamp,
    markdown,
    rangeLength,
    paragraph,
    reaction,
  } = comment;
  let type: ReactionDisplayType | undefined;

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

/**
 * Create a map preducate for mapping a collection for a reaction's post
 * @param nodes 
 * @returns 
 */
const mapReactionCollection = (
  nodes: { slug: string, fields: { collection: string } }[]
) => <ExtendedComment extends CommentQuery>(comment: ExtendedComment) => ({
  ...comment,
  collection: nodes.find(
    ({ slug: nodeSlug }) => nodeSlug === comment.slug
  )?.fields?.collection,
});

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
  max-width: 19.5rem;
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

const ProfileAvatar = styled(Avatar)`
  flex-shrink: 0;
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

const ProfileBlurbsSection = styled.section<{ isLoading: boolean }>`
  margin: ${(props) => props.theme.spacingHalf} 0
    ${(props) => props.theme.spacing} 0;

  ${(props) => props.isLoading && `opacity: .7`};
  transition: opacity ${(props) => props.theme.animationFast} ease-out;
`;

const ProfileBlurb = styled.section<{ secondary: boolean }>`
  display: inline-block;
  ${(props) => props.secondary && `color: ${props.theme.secondaryTextColor}`};
  line-height: ${(props) => props.theme.normalFontLineHight};
  padding: 8px;
  padding-left: 15px;
  margin-right: ${(props) => props.theme.spacingQuarter};
`;

const ProfileInput = styled.input`
  font-family: ${(props) => props.theme.normalFont};
  font-size: ${(props) => props.theme.normalFontSize};
  font-weight: ${(props) => props.theme.normalFontWeight};

  box-sizing: border-box;
  width: 100%;
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
    flex: 1;
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

  align-self: center;
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
  flex-shrink: 0;
  flex-basis: calc(
    ${(props) => props.theme.spacing} + ${(props) => props.theme.spacingQuarter}
  );

  @media (max-width: ${MOBILE}) {
    margin-top: calc(0px - ${(props) => props.theme.border});
  }
`;

const StyledLocationIcon = styled(LocationIcon)`
  flex-shrink: 0;
  flex-basis: calc(
    ${(props) => props.theme.spacing} + ${(props) => props.theme.spacingQuarter}
  );
  margin-top: calc(0px - ${(props) => props.theme.border});
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

const ProfileBlurbs: FC<{
  profile: ReturnType<typeof useProfile>['profile'];
  isForAnotherUser: boolean;
  isSaving: boolean;
  editBioRef: React.MutableRefObject<HTMLInputElement>;
  editingBio: boolean;
  bioText: string;
  setBioText: (text: string) => void;
  handleEditBio: ReturnType<typeof useProfile>['handleEditBio'];
  editLocationRef: React.MutableRefObject<HTMLInputElement>;
  editingLocation: boolean;
  locationText: string;
  setLocationText: (text: string) => void;
  handleEditLocation: ReturnType<typeof useProfile>['handleEditLocation'];
}> = ({
  profile,
  isForAnotherUser,
  isSaving,
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
}) => (
    <ProfileBlurbsSection isLoading={isSaving}>
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
            <ProfileBlurb secondary>no bio</ProfileBlurb>
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
            <ProfileBlurb secondary>{profile.locationName}</ProfileBlurb>
          ) : (
            <ProfileBlurb secondary>no location</ProfileBlurb>
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
    </ProfileBlurbsSection>
  );

const ProfileReaction: FC<CommentQuery & { type: ReactionDisplayType, collection: string }> = ({
  slug,
  collection,
  timestamp,
  reaction: emoji,
  type
}) => {
  const reactionDate = formatCommentDate(timestamp);
  const GenericIcon = REACTION_TYPE_ICONS[type];
  const Icon = emoji ? REACTION_ICONS[emoji] : GenericIcon;
  const detail = REACTION_DETAILS[type].replace(
    ':reaction',
    REACTION_NAMES[emoji] ?? ''
  );
  const textPrimary = detail.split(' ')[0];
  const textSecondary = detail.substring(
    textPrimary.length + 1
  );
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
};

const Profile: FC<ProfileQuery> = ({
  data: {
    allMdx: { nodes },
  },
}) => {
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
          <ProfileBlurbs {...{
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
          }} />

          <ProfileGroup horizontal>
            {reactionSummary && (
              <ProfileTile>
                <ProfileTileBorder />
                <ProfileHeading>reactions</ProfileHeading>

                {reactionCount == 0 && <SecondaryText>none</SecondaryText>}

                {Object.keys(reactionSummary)
                  .filter((r) => reactionSummary[r])
                  .map((emoji) => {
                    const ReactionFilterIcon = REACTION_ICONS[emoji];
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
                .map(mapReactionDisplayType)
                .filter(filterDisplayableAndMatchingSearch(reactionFilter))
                .map(mapReactionCollection(nodes))
                .sort(sortByDateTimeDescending)
                .slice(0, more ? undefined : MAX_ITEMS)
                .map((reaction) => <ProfileReaction key={reaction.timestamp} {...reaction} />)
              }
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
