const { gql } = require('apollo-server-lambda');

exports.typeDefs = gql`
  enum Reaction {
    snap,
    party,
    laugh,
    confused
  }

  type Comment {
    slug: String!
    timestamp: String!
    userId: String!

    parentTimestamp: String
    markdown: String
    reaction: Reaction
    votes: Int

    paragraph: String
    rangeStart: Int
    rangeLength: Int
  }

  input CommentInput {
    slug: String!
    parentId: String
    markdown: String
    reaction: Reaction
    paragraph: String
    rangeStart: Int
    rangeLength: Int
  }

  input VoteCommentInput {
    slug: String!
    timestamp: String!
    upVote: Boolean
    downVote: Boolean
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

  type Query {
    comments(slug: String!): [Comment!]!
    comment(slug: String!, timestamp: String!): Comment
  }

  type Mutation {
    addComment(comment: CommentInput!): Comment
    editComment(comment: EditCommentInput!): Comment
    voteComment(comment: VoteCommentInput!): Comment
    deleteComment(comment: DeleteCommentInput!): Comment
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
