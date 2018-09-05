const moment = require('moment');

const getParams = keyword => ({
  TableName: process.env.EVENTS_TABLE,
  IndexName: 'KeywordIndex',
  KeyConditionExpression: `#gsi = :gsi`,
  ExpressionAttributeNames: {
    '#gsi': 'keyword'
  },
  ExpressionAttributeValues: {
    ':gsi': keyword
  }
});

const AWSConfig = {
  secretAccessKey: process.env.DB_SAK,
  accessKeyId: process.env.DB_AK,
  region: process.env.DB_REGION,
  endpoint: process.env.DB_ENDPOINT
};

module.exports = function(keyword, edition) {
  // WARNING: see https://arunoda.me/blog/ssr-and-server-only-modules
  const AWS = eval("require('aws-sdk')");
  AWS.config.update(AWSConfig);

  let dbDocClient = new AWS.DynamoDB.DocumentClient();
  let params = getParams(keyword);

  return new Promise((resolve, reject) => {
    dbDocClient.query(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      let items = data.Items;
      if (edition) {
        items = items.filter(
          ({ date }) => moment.unix(date).format('YYYY') === edition
        );
      } else if (items.length > 1) {
        items = items
          .filter(({ date }) => date >= moment().unix())
          .sort((eventA, eventB) => eventA.date - eventB.date);
      }
      resolve(items[0]);
    });
  });
};
