const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });

const db = new AWS.DynamoDB.DocumentClient();

module.exports.getComment = async (slug, timestamp) => {
  const { Item } = await db
    .get({
      TableName: 'zeroweb-comments',
      Key: {
        slug,
        timestamp
      }
    })
    .promise();

  return Item;
};

module.exports.getComments = async (slug) => {
  const { Items } = await db
    .query({
      TableName: 'zeroweb-comments',
      KeyConditionExpression: 'slug = :slug',
      ExpressionAttributeValues: {
        ':slug': slug
      }
    })
    .promise();

  return Items;
};

module.exports.addComment = async (comment) => {
  const Item = { ...comment, votes: 0 };
  await db
    .put({
      TableName: 'zeroweb-comments',
      Item
    })
    .promise();

  return Item;
};

module.exports.editComment = async (comment) => {
  const { slug, timestamp, markdown } = comment;
  await db
    .update({
      TableName: 'zeroweb-comments',
      Key: {
        slug,
        timestamp
      },
      UpdateExpression: 'set markdown = :markdown',
      ExpressionAttributeValues: {
        ':markdown': markdown
      }
    })
    .promise();

  return await getComment(slug, timestamp);
};

module.exports.voteComment = async (slug, timestamp, vote) => {
  if (vote) {
    await db
      .update({
        TableName: 'zeroweb-comments',
        Key: {
          slug,
          timestamp
        },
        UpdateExpression: 'set votes = votes + :vote',
        ExpressionAttributeValues: {
          ':vote': vote
        }
      })
      .promise();
  }

  const old = await getComment(slug, timestamp);
  return { ...old, votes: old.votes + vote };
};

module.exports.deleteComment = async (comment) => {
  const { slug, timestamp } = comment;
  await db
    .delete({
      TableName: 'zeroweb-comments',
      Key: {
        slug,
        timestamp
      },
    })
    .promise();

  return comment;
};
