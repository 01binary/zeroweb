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
import { graphql, Link } from 'gatsby';
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
import Frame from '../images/frame.svg';

type ReactionType =
  | 'CommentReaction'
  | 'PostReaction'
  | 'CommentReply'
  | 'ParagraphComment'
  | 'PostComment'
  | 'ParagraphHighlight';

const reactionDetail: Record<ReactionType, string> = {
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
  confused: 'yeeted wildly to',
};

const reactionTypeIcons: Record<ReactionType, React.FunctionComponent> = {
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

const getPagePath = (collection, slug) => {
  if (collection === 'logs') {
    const [, projectPath, logPath] = slug.split('/');
    return `../projects/${projectPath}/${logPath}`;
  }

  return `../${collection}/${slug}`;
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
  flex-wrap: wrap;
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
  margin-left: ${(props) => props.theme.spacingQuarter};
`;

const ReactionDescription = styled.div`
  flex: 1 1;
`;

const SecondaryText = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;

const ReactionDate = styled.div`
  min-width: 7em;
`;

const StaticDate = styled.span`
  color: ${(props) => props.theme.secondaryTextColor};
`;

const LinkButton = styled.button`
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
  const [more, setMore] = useState<boolean>(false);
  const [reactionFilter, setReactionFilter] = useState<Reaction | null>(null);
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
              <ProfileBlurb deEmphasize>{profile.locationName}</ProfileBlurb>
            )}
          </ProfileBlurbs>

          <ProfileRow horizontal>
            {reactionSummary && (
              <ProfileTile>
                <ProfileTileBorder />
                <ProfileHeading>Reactions</ProfileHeading>

                {reactionCount == 0 && (
                  <SecondaryText>nopity nope</SecondaryText>
                )}

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
                <ProfileHeading>Last reaction</ProfileHeading>
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
                  <SecondaryText>like never</SecondaryText>
                ) : (
                  <>
                    {profile.voteCount} <SecondaryText>times</SecondaryText>
                  </>
                )}
              </ProfileTile>
            )}
          </ProfileRow>

          {profile?.reactions?.length > 0 && (
            <ReactionList>
              {profile.reactions
                .map(reactionType)
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
                      <ReactionType>
                        <Icon />
                      </ReactionType>
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
                <LinkButton onClick={() => setMore(true)}>
                  See more...
                </LinkButton>
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
