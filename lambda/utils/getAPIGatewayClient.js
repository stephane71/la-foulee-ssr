const apigClientFactory = require('aws-api-gateway-client').default;

const config = {
  invokeUrl: `https://api.la-foulee.com/${process.env.stageAPI}`,
  region: 'eu-west-1',
  accessKey: process.env.AccessKeyID,
  secretKey: process.env.SecretAccessKey
};

module.exports = function() {
  return apigClientFactory.newClient(config);
};
