const apigClientFactory = require("aws-api-gateway-client").default;

const { getAroundEventListArgs } = require("../api");

const apiClient = apigClientFactory.newClient({
  invokeUrl: `${process.env.API_URL}/events`,
  region: process.env.API_REGION,
  accessKey: process.env.DB_AK,
  secretKey: process.env.DB_SAK
});

module.exports = function(geohash) {
  const args = getAroundEventListArgs(geohash);
  return apiClient.invokeApi(...args).then(res => res.data.events);
};
