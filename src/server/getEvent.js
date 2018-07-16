module.exports = function(keyword) {
  // WARNING: see https://arunoda.me/blog/ssr-and-server-only-modules
  const AWS = eval("require('aws-sdk')");

  const AWSConfig = {
    secretAccessKey: process.env.DB_SAK,
    accessKeyId: process.env.DB_AK,
    region: process.env.DB_REGION,
    endpoint: process.env.DB_ENDPOINT
  };

  AWS.config.update(AWSConfig);
  let dbDocClient = new AWS.DynamoDB.DocumentClient();

  return new Promise((resolve, reject) => {
    dbDocClient.query(
      {
        TableName: process.env.EVENTS_TABLE,
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
          reject(err);
          return;
        }
        resolve(data.Items[0]);
      }
    );
  });
};
