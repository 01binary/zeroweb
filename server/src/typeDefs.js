import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
  type Comment {
    slug: String!
    timestamp: String!
    user: String!
    votes: Int
    markdown: String
    paragraph: String
    rangeStart: Int
    rangeLength: Int
  }

  input CommentInput {
    slug: String!
    markdown: String
    paragraph: String
    rangeStart: Int
    rangeLength: Int
  }

  input DeleteCommentInput {
    slug: String!
    timestamp: String!
  }

  type DeleteCommentResult {
    slug: String
    timestamp: String
  }

  type Query {
    comments(slug: String!): [Comment!]!
  }

  type Mutation {
    addComment(comment: CommentInput!): Comment
    deleteComment(comment: DeleteCommentInput!): DeleteCommentResult
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
