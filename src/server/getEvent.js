module.exports = function(keyword) {
  // WARNING: see https://arunoda.me/blog/ssr-and-server-only-modules
  const AWS = eval("require('aws-sdk')");

  const AWSConfig = {
    secretAccessKey: process.env.secretAccessKey,
    accessKeyId: process.env.accessKeyId,
    region: 'eu-west-3',
    endpoint: 'https://dynamodb.eu-west-3.amazonaws.com'
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
          console.log(err, err.stack);
          reject(err);
          return;
        }
        resolve(data.Items[0]);
      }
    );
  });
};
