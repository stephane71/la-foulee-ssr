const slug = require("slug");
const apigClientFactory = require("aws-api-gateway-client").default;

const { getPlaceArgs } = require("../api");

const apiClient = apigClientFactory.newClient({
  invokeUrl: `${process.env.API_URL}/events`,
  region: process.env.API_REGION,
  accessKey: process.env.DB_AK,
  secretKey: process.env.DB_SAK
});

module.exports = async function({ department, city }) {
  const args = getPlaceArgs({ department, city });
  return apiClient.invokeApi(...args).then(res => res.data);
};
