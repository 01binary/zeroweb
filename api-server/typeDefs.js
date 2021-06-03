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
    userName: String!
    avatarUrl: String!

    parentTimestamp: String
    markdown: String
    reaction: Reaction
    votes: Int

    paragraph: String
    rangeStart: Int
    rangeLength: Int
  }

  type DeleteComment {
    slug: String!
    timestamp: String!
    userId: String!
    deleted: Boolean!
  }

  input CommentInput {
    slug: String!
    userName: String!
    avatarUrl: String!

    parentId: String
    markdown: String
    reaction: Reaction
    paragraph: String
    rangeStart: Int
    rangeLength: Int
  }

  enum Vote {
    upvote,
    downvote
  }

  input VoteCommentInput {
    slug: String!
    timestamp: String!
    vote: Vote!
  }

  input DeleteCommentInput {
    slug: String!
    timestamp: String!
  }

  input EditCommentInput {
    slug: String!
    timestamp: String!
    markdown: String
    reaction: Reaction
  }

  type Query {
    comments(slug: String!): [Comment!]!
    comment(slug: String!, timestamp: String!): Comment
  }

  type Mutation {
    addComment(comment: CommentInput!): Comment!
    editComment(comment: EditCommentInput!): Comment!
    voteComment(comment: VoteCommentInput!): Comment!
    deleteComment(comment: DeleteCommentInput!): DeleteComment
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
