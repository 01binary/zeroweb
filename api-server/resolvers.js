const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server");
const {
  getComments,
  getComment,
  addComment,
  deleteComment,
  editComment,
  voteComment,
  getVote,
  addVote,
  getReaction,
  addReaction,
  getVotes,
  getShares,
  getShare,
  addShare,
  getProfile,
  editProfile,
} = require('./database');

exports.resolvers = {
  Query: {
    comments: async (
      root,
      { slug },
      { user }
    ) => {
      const comments = await getComments(slug);

      // For anonymous users, return comments immediately
      if (!user?.authenticated) return comments.map(comment => ({
        ...comment,
        voted: null,
        me: null
      }));

      // For logged in users, indicate their comments and if already voted
      const votes = await getVotes(user.id);

      return comments.map(comment => ({
        ...comment,
        voted: Boolean(votes.find(({ timestamp }) => timestamp === comment.timestamp))
      }));
    },

    comment: async (root, { slug, timestamp }) => {
      return getComment(slug, timestamp);
    },

    shares: async (root, { slug }) => {
      return getShares(slug);
    },

    profile: async (root, { userId }) => {
      return getProfile(userId);
    },
  },
  Mutation: {
    addComment: async (
      root,
      { comment },
      { user },
    ) => {
      const isPostReaction = comment.reaction === 'snap' && !comment.parentTimestamp;

      if (!user?.authenticated && !isPostReaction) throw new AuthenticationError(
        'must be logged in with a social provider to add comments, highlights, or reactions'
      );

      if (comment.reaction && (comment.markdown || comment.rangeLength))
        throw new UserInputError('cannot add reaction with a comment or highlight');

      const { slug, parentTimestamp } = comment;

      if (comment.reaction && !isPostReaction) {
        const alreadyReacted = await getReaction(slug, parentTimestamp, user.id);
        if (alreadyReacted) throw new UserInputError('already reacted to this comment or post');
      }

      const added = await addComment({
        ...comment,
        timestamp: new Date().toISOString(),
        userId: user.id,
        upVotes: 0,
        downVotes: 0,
      });

      if (comment.reaction) await addReaction(slug, parentTimestamp, user.id);

      return added;
    },

    editComment: async (
      root,
      { comment: { slug, timestamp, markdown, reaction } },
      { user },
    ) => {
      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in with a social provider to edit comments'
      );

      const original = await getComment(slug, timestamp);
      if (original.userId !== user.id) throw new UserInputError(
        'users can only edit their own comments or reactions'
      );

      const votes = await getVotes(user.id);
      const updated = await editComment(
        {
          slug,
          timestamp,
          markdown,
          reaction,
        },
        original
      );

      return {
        ...updated,
        voted: Boolean(votes.find(
          ({ timestamp: voteTimestamp }) => voteTimestamp === timestamp
        ))
      }
    },

    addShare: async (
      root,
      { share: { slug, shareType } },
    ) => {
      const existing = await getShare(slug, shareType);
      const count = existing ? existing.count + 1 : 1;
      const share = { slug, shareType, count };

      await addShare(share);

      return share;
    },

    editProfile: async (
      root,
      { profile },
      { user },
    ) => {
      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in with a social provider to edit your profile'
      );
      return editProfile(user.id, profile);
    },

    voteComment: async (
      root,
      { comment: { slug, timestamp, vote } },
      { user },
    ) => {
      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in with a social provider to vote on comments'
      );

      const original = await getComment(slug, timestamp);
      if (original.reaction) throw new UserInputError('cannot vote on reactions');
      if (!original.markdown) throw new UserInputError('cannot vote on highlights');
      if (original.userId === user.id) throw new UserInputError('cannot vote on your own comments');

      const alreadyVoted = await getVote(timestamp, user.id);
      if (alreadyVoted) throw new UserInputError('already voted');

      await addVote(timestamp, user.id);

      const updated = await voteComment(
        {
          slug,
          timestamp,
          upVotes: vote === 'upVote' ?
            original.upVotes + 1 : original.upVotes,
          downVotes: vote === 'downVote' ?
            original.downVotes + 1 : original.downVotes,
        },
        original
      );

      return {
        ...updated,
        voted: true,
      };
    },

    deleteComment: async (
      root,
      { comment: { slug, timestamp } },
      { user },
    ) => {
      if (!user?.authenticated) throw new AuthenticationError(
        'must be logged in to delete comments, highlights, and reactions'
      );

      const comment = await getComment(slug, timestamp);
      if (!comment) throw new UserInputError('comment not found');

      const { userId: originalUserId } = comment;
      if (originalUserId !== user.id) throw new UserInputError(
        'users can only delete their own comments, highlights, and reactions'
      );

      return deleteComment({
        slug,
        timestamp,
        userId: user.id,
      });
    },
  }
};
