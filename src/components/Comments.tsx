import React, { FC } from 'react';
import styled from 'styled-components';
import { ApolloClient } from 'apollo-client';
import useComments from '../hooks/useComments';
import Avatar from '../components/Avatar';
import MetaLink from '../components/MetaLink';
import Login from './Login';
import Error from './Error';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type CommentsProps = {
  slug: string;
  client: ApolloClient;
};

const Footer = styled.footer`
  h2 {
    font-size: ${props => props.theme.headingFontSizeMedium};
    font-weight: ${props => props.theme.headingFontWeight};
  }

  p, li {
    font-family: ${props => props.theme.smallFont};
    font-size: ${props => props.theme.smallFontSize};
    font-weight: ${props => props.theme.smallFontWeight};
    line-height: 1.7em;
  }

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: initial;
    margin-right: 0.25em;
  }
`;

const CommentsList = styled.ul`
  list-style-type: none;
  max-width: calc(80% - 5em);
  margin-block-end: 0;
  margin-top: ${props => props.theme.spacing};
  margin-bottom: ${props => props.theme.spacingHalf};
  margin-left: ${props => props.theme.spacingTriple};
  margin-right: 0;
  padding: 0;

  @media(max-width: ${props => props.theme.mobile}) {
    max-width: initial;
  }
`;

const Comment = styled.li`
  position: relative;
  margin-bottom: .7em;

  &:before {
    content: '';
    position: absolute;
    border-right: ${props => props.theme.border} dotted ${props => props.theme.borderColor};
    top: 28px;
    left: -40px;
    height: calc(100% - 20px);
    z-index: -1;
  }

  &:last-of-type::before {
    height: 100%;
  }
`;

const getAvatarHorzOffset = (index) => {
  if (index % 2) {
    return -19;
  } else {
    return 0;
  }
};

const CommentAvatar = styled.div`
  position: absolute;
  left: calc(-25px - 2em + ${props => getAvatarHorzOffset(props.index)}px);
  top: -.5em;
`;

const CommentContent = styled.span`
  margin: 0 ${props => props.theme.spacingHalf};
`;

const CommentDate = styled.span`
  color: ${props => props.theme.secondaryTextColor};
  position: absolute;
  left: calc(100% + 1em);
  width: 8em;

  @media(max-width: ${props => props.theme.mobile}) {
    position: initial;
    left: initial;
    width: initial;
  }
`;

const formatCommentDate = (timestamp) => dayjs(timestamp).fromNow();

const Comments: FC<CommentsProps> = ({
  slug,
  client
}) => {
  const { comments, loading, error } = useComments(slug, client);
  return (
    <Footer>
      {comments && comments.length > 0 && <h2>Comments [{comments.length}]</h2>}

      {comments && !comments.length && <h2>Comments</h2>}

      {loading && <p>Loading comments...</p>}

      {error && <Error>{error}</Error>}

      {comments && comments.length > 0 && (
        <CommentsList>
          {comments
            .filter(({ markdown }) => markdown && markdown.length)
            .sort(({ timestamp }) => timestamp)
            .map(({
              timestamp,
              markdown,
              avatarUrl,
              userId,
              userName
            }, index) => (
              <Comment key={timestamp}>
                <CommentAvatar index={index}>
                  <Avatar avatarUrl={avatarUrl} />
                </CommentAvatar>
                <MetaLink to={`/users/${userId}`}>{userName}</MetaLink>
                <CommentDate>
                  {' '}{formatCommentDate(timestamp)}
                </CommentDate>
                <CommentContent>
                  {markdown}
                </CommentContent>
              </Comment>
            ))}
        </CommentsList>
      )}

      <Login />
    </Footer>
  );
};

export default Comments;
