import React, { FC } from 'react';
import styled from 'styled-components';
import Login from './Login';
import useComments from '../hooks/useComments';

type CommentsProps = {
  slug: string;
  client: ApolloClient;
};

const Error = styled.section`
  color: ${props => props.theme.errorColor};
`;

const Comments: FC<CommentsProps> = ({
  slug,
  client
}) => {
  const { comments, loading, error } = useComments(slug, client);
  return (
    <>
      <h2>Comments</h2>

      {loading && <div>Loading comments...</div>}
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
