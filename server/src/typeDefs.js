const gql = require('apollo-server-lambda').gql;

module.exports.typeDefs = gql`
  type Comment {
    slug: String!
    timestamp: String!
    user: String!
    votes: Int!
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

  input EditCommentInput {
    slug: String!
    timestamp: String!
    markdown: String!
  }

  input VoteCommentInput {
    slug: String!
    timestamp: String!
    upvote: Boolean
    downvote: Boolean
  }

  type CommentOperationResult {
    slug: String
    timestamp: String
    user: String
    votes: Int
    markdown: String
    paragraph: String
    rangeStart: Int
    rangeLength: Int
  }

  type Query {
    comments(slug: String!): [Comment!]!
    comment(slug: String!, timestamp: String!): Comment
  }

  type Mutation {
    addComment(comment: CommentInput!): Comment
    deleteComment(comment: DeleteCommentInput!): CommentOperationResult
    editComment(comment: EditCommentInput!): CommentOperationResult
    voteComment(comment: VoteCommentInput!): CommentOperationResult
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
