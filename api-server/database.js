const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

const TableName = 'zeroweb-comments';
const db = new AWS.DynamoDB.DocumentClient();

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
  return comment;
};

exports.editComment = async ({
  slug,
  timestamp,
  markdown,
  reaction,
}, original) => {
  await db
    .update({
      TableName,
      Key: {
        slug,
        timestamp,
      },
      UpdateExpression: 'set markdown = :markdown, reaction = :reaction',
      ExpressionAttributeValues: {
        ':markdown': markdown,
        ':reaction': reaction,
      }
    })
    .promise();

  return {
    ...original,
    markdown,
    reaction
  };
};

exports.voteComment = async ({
  slug,
  timestamp,
  votes,
}, original) => {
  await db
    .update({
      TableName,
      Key: {
        slug,
        timestamp,
      },
      UpdateExpression: 'set votes = :votes',
      ExpressionAttributeValues: {
        ':votes': votes,
      }
    })
    .promise();

  return { ...original, votes };
};

exports.deleteComment = async ({
  slug,
  timestamp,
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

  return comment;
};
