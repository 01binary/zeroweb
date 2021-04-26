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

export const editComment = async(slug, timestamp, markdown) => {

};

export const voteComment = async(slug, timestamp, upVote) => {

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
