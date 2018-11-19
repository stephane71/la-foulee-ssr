const apigClientFactory = require("aws-api-gateway-client").default;

const {
  API_EVENT_LIST_AROUND,
  API_EVENT_LIST_DEPARTMENT,
  getEventListArgs
} = require("../api");

const apiClient = apigClientFactory.newClient({
  invokeUrl: `${process.env.API_URL}/events`,
  region: process.env.API_REGION,
  accessKey: process.env.DB_AK,
  secretKey: process.env.DB_SAK
});

module.exports = {
  getEventListAround: function(geohash) {
    const args = getEventListArgs(API_EVENT_LIST_AROUND, { geohash });
    return apiClient.invokeApi(...args).then(res => res.data.events);
  },
  getEventListDepartment: function(code) {
    const args = getEventListArgs(API_EVENT_LIST_DEPARTMENT, { code });
    return apiClient.invokeApi(...args).then(res => res.data.events);
  }
};
