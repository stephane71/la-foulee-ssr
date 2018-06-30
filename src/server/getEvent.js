module.exports = function(keyword) {
  // WARNING: see https://arunoda.me/blog/ssr-and-server-only-modules
  const AWS = eval("require('aws-sdk')");

  const AWSConfig = {
    secretAccessKey: process.env.secretAccessKey,
    accessKeyId: process.env.accessKeyId,
    region: process.env.region,
    endpoint: process.env.DB
  };

  AWS.config.update(AWSConfig);
  let dbDocClient = new AWS.DynamoDB.DocumentClient();

  const eventPage = '/event';

  return new Promise((resolve, reject) => {
    dbDocClient.query(
      {
        TableName: 'Events',
        IndexName: 'KeywordIndex',
        KeyConditionExpression: `#gsi = :gsi`,
        ExpressionAttributeNames: {
          '#gsi': 'keyword'
        },
        ExpressionAttributeValues: {
          ':gsi': keyword
        }
      },
      (err, data) => {
        if (err) {
          console.log(err, err.stack);
          reject(err);
          return;
        }
        resolve(data.Items[0]);
      }
    );
  });
};
