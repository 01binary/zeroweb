const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

const TableName = 'zeroweb-comments';
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
      TableName,
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
      TableName,
      KeyConditionExpression: 'slug = :slug',
      ExpressionAttributeValues: {
        ':slug': slug
      }
    })
    .promise();

  return Items;
};

exports.addComment = async (Item) => {
  await db.put({ TableName, Item }).promise();
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
      TableName,
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
    votes,
  },
  original
) => {
  const update = { votes };
  await db
    .update({
      TableName,
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
      TableName,
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

exports.getVote = async (
  timestamp,
  userId,
) => {
  const { Item } = await db
    .get({
      TableName: 'zeroweb-votes',
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
      TableName: 'zeroweb-votes',
      Item: { timestamp, userId },
    })
    .promise()
);
