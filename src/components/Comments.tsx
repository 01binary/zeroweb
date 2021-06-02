import React, { FC } from 'react';
import styled from 'styled-components';
import Login from './Login';
import Error from './Error';
import useComments from '../hooks/useComments';
import { ApolloClient } from 'apollo-client';

type CommentsProps = {
  slug: string;
  client: ApolloClient;
};

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
        <ul>
          {comments.map(({ timestamp, markdown }) => (
            <li key={timestamp}>{markdown}</li>
          ))}
        </ul>
      )}

      <Login />
    </>
  );
};

export default Comments;
