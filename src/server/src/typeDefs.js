import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
  scalar Timestamp

  type Comment {
    slug: String!
    timestamp: Timestamp!
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

  type Query {
    comments(slug: String!): [Comment!]!
  }

  type Mutation {
    addComment(comment: CommentInput!): Comment
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
