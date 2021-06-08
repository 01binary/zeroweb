import React, { FC } from 'react';
import styled from 'styled-components';
import { ApolloClient } from 'apollo-client';
import useComments from '../hooks/useComments';
import Avatar from '../components/Avatar';
import MetaLink from '../components/MetaLink';
import Login from './Login';
import Error from './Error';

type CommentsProps = {
  slug: string;
  client: ApolloClient;
};

const CommentsList = styled.ul`
  list-style-type: none;
  margin-block-end: 0;
  margin-top: ${props => props.theme.spacing};
  margin-bottom: ${props => props.theme.spacingHalf};
  margin-left: ${props => props.theme.spacingHalf};
  margin-right: 0;
  padding: 0;
`;

const Comment = styled.li`
  position: relative;
  margin-bottom: .7em;
`;

const getAvatarHorzOffset = (index) => {
  if (index % 2) {
    return -19;
  } else {
    return 0;
  }
};

const getAvatarVertOffset = (index) => {
  if (index % 2) {
    return -4;
  } else {
    return 2;
  }
};

const CommentAvatar = styled.div`
  position: absolute;
  left: calc(-25px - 2em + ${props => getAvatarHorzOffset(props.index)}px);
  top: calc(-.5em + ${props => getAvatarVertOffset(props.index)}px);
`;

const CommentContent = styled.span`
  margin: 0 ${props => props.theme.spacingHalf};
`;

const Footer = styled.footer`
  margin-top: -6em;

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
`;

const Comments: FC<CommentsProps> = ({
  slug,
  client
}) => {
  const { comments, loading, error } = useComments(slug, client);
  return (
    <Footer>
      <h2>Comments</h2>

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
