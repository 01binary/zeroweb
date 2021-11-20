const { gql } = require('apollo-server-lambda');

exports.typeDefs = gql`
  enum Reaction {
    snap,
    party,
    lol,
    wow,
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
    upVotes: Int
    downVotes: Int
    voted: Boolean
    me: Boolean

    paragraph: String
    rangeStart: Int
    rangeLength: Int
  }

  enum ShareType {
    link,
    twitter,
    facebook,
    linkedIn,
    email
  }

  type Share {
    slug: String!
    shareType: ShareType!
    count: Int!
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

    parentTimestamp: String
    markdown: String
    reaction: Reaction
    paragraph: String
    rangeStart: Int
    rangeLength: Int
  }

  enum Vote {
    upVote,
    downVote
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

  input ShareInput {
    slug: String!
    shareType: ShareType!
  }

  type Query {
    comments(slug: String!): [Comment!]!
    comment(slug: String!, timestamp: String!): Comment
    shares(slug:String!): [Share!]!
  }

  type Mutation {
    addComment(comment: CommentInput!): Comment!
    editComment(comment: EditCommentInput!): Comment!
    voteComment(comment: VoteCommentInput!): Comment!
    deleteComment(comment: DeleteCommentInput!): DeleteComment
    addShare(share: ShareInput!): Share!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
