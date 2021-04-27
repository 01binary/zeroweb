import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-west-2' });

const db = new AWS.DynamoDB.DocumentClient();

export const getComment = async (slug, timestamp) => {
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

export const getComments = async (slug) => {
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

export const addComment = async (comment) => {
  const Item = { ...comment, votes: 0 };
  await db
    .put({
      TableName: 'zeroweb-comments',
      Item
    })
    .promise();

  return Item;
};

export const editComment = async (comment) => {
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

export const voteComment = async (slug, timestamp, vote) => {
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

export const deleteComment = async (comment) => {
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