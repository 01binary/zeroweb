import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-west-2' });

const db = new AWS.DynamoDB.DocumentClient();

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
