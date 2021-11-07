const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

const COMMENTS_TABLE = 'zeroweb-comments';
const VOTES_TABLE = 'zeroweb-votes';
const REACTIONS_TABLE = 'zeroweb-reactions';

const db = new AWS.DynamoDB.DocumentClient();

const getUpdateExpression = (fields) => (
  Object.keys(fields).reduce((expression, key) => (
    fields[key] !== undefined
      ? `${expression}${expression.length ? ', ' : 'set '}${key} = :${key}`
      : expression
  ), '')
);

const getUpdateAttributes = (fields) => (
  Object.keys(fields).reduce((attributes, key) => (
    fields[key] !== undefined
    ? {
        ...attributes,
        [`:${key}`]: fields[key] 
      }
    : attributes
  ), {})
);

const getUpdateResult = (original, update) => (
  Object.keys(update).reduce((merged, key) => (
    update[key] !== undefined
    ? { ...merged, [key]: update[key] }
    : merged
  ), original)
);

exports.getComment = async (slug, timestamp) => {
  const { Item: comment } = await db
    .get({
      TableName: COMMENTS_TABLE,
      Key: {
        slug,
        timestamp
      }
    })
    .promise();

  return comment;
};

exports.getComments = async (slug) => {
  const { Items } = await db
    .query({
      TableName: COMMENTS_TABLE,
      KeyConditionExpression: 'slug = :slug',
      ExpressionAttributeValues: {
        ':slug': slug
      }
    })
    .promise();

  return Items;
};

exports.addComment = async (Item) => {
  await db.put({ TableName: COMMENTS_TABLE, Item }).promise();
  return Item;
};

exports.editComment = async (
  {
    slug,
    timestamp,
    markdown,
    reaction,
  },
  original
) => {
  const update = { markdown, reaction };
  await db
    .update({
      TableName: COMMENTS_TABLE,
      Key: {
        slug,
        timestamp
      },
      UpdateExpression: getUpdateExpression(update),
      ExpressionAttributeValues: getUpdateAttributes(update),
    })
    .promise();

  return getUpdateResult(original, update);
};

exports.voteComment = async (
  {
    slug,
    timestamp,
    upVotes,
    downVotes,
  },
  original
) => {
  const update = { upVotes, downVotes };
  await db
    .update({
      TableName: COMMENTS_TABLE,
      Key: {
        slug,
        timestamp,
      },
      UpdateExpression: getUpdateExpression(update),
      ExpressionAttributeValues: getUpdateAttributes(update),
    })
    .promise();

  return getUpdateResult(original, update);
};

exports.deleteComment = async ({
  slug,
  timestamp,
  userId,
}) => {
  await db
    .delete({
      TableName: COMMENTS_TABLE,
      Key: {
        slug,
        timestamp
      },
    })
    .promise();

  return {
    slug,
    timestamp,
    userId,
    deleted: true
  };
};

exports.getVotes = async(
  userId
) => {
  const { Items } = await db
    .scan({
      TableName: VOTES_TABLE,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise();

  return Items;
}

exports.getVote = async (
  timestamp,
  userId,
) => {
  const { Item } = await db
    .get({
      TableName: VOTES_TABLE,
      Key: {
        timestamp,
        userId,
      },
    })
    .promise();

  return Item;
};

exports.addVote = async (
  timestamp,
  userId,
) => (
  db
    .put({
      TableName: VOTES_TABLE,
      Item: { timestamp, userId },
    })
    .promise()
);

exports.getReaction = async (
  slug,
  timestamp,
  userId,
) => {
  const { Item } = await db
    .get({
      TableName: REACTIONS_TABLE,
      Key: {
        slugTimestamp: `${slug}:${timestamp}`,
        userId,
      },
    })
    .promise();

  return Item;
};

exports.addReaction = async (
  slug,
  timestamp,
  userId,
) => (
  db
    .put({
      TableName: REACTIONS_TABLE,
      Item: { slugTimestamp: `${slug}:${timestamp}`, userId },
    })
    .promise()
);
