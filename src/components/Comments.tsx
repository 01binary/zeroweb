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
  margin: 0 ${props => props.theme.spacingHalf};
  padding: 0;
`;

const Comment = styled.li`
`;

const CommentContent = styled.span`
  margin: 0 ${props => props.theme.spacingHalf};
`;

const Comments: FC<CommentsProps> = ({
  slug,
  client
}) => {
  const { comments, loading, error } = useComments(slug, client);
  return (
    <>
      <h2>Comments</h2>

      {loading && <p>Loading comments...</p>}

      {error && <Error>{error}</Error>}

      {comments && !comments.length && (
        <p>No comments yet.</p>
      )}

      {comments && comments.length > 0 && (
        <CommentsList>
          {comments.map(({
            timestamp,
            markdown,
            avatarUrl,
            userName
          }) => (
            <Comment key={timestamp}>
              <Avatar avatarUrl={avatarUrl} />
              <MetaLink>{userName}</MetaLink>
              <CommentContent>{markdown}</CommentContent>
            </Comment>
          ))}
        </CommentsList>
      )}

      <Login />
    </>
  );
};

export default Comments;
