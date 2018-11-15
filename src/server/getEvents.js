const apigClientFactory = require("aws-api-gateway-client").default;
const fs = require("fs");

const {
  API_EVENT_LIST_AROUND,
  API_EVENT_LIST_DEPARTMENT,
  getEventListArgs
} = require("../api");

const DEPARTMENTS_FILE = "./src/server/departments.json";
const departments = JSON.parse(fs.readFileSync(DEPARTMENTS_FILE));

const apiClient = apigClientFactory.newClient({
  invokeUrl: `${process.env.API_URL}/events`,
  region: process.env.API_REGION,
  accessKey: process.env.DB_AK,
  secretKey: process.env.DB_SAK
});

function getDepartmentCode(department) {
  const dep = departments.find(({ slug }) => slug === department);
  return dep ? dep.code : null;
}

module.exports = {
  getEventListAround: function(geohash) {
    const args = getEventListArgs(API_EVENT_LIST_AROUND, { geohash });
    return apiClient.invokeApi(...args).then(res => res.data.events);
  },
  getEventListDepartment: function(department) {
    const code = getDepartmentCode(department);
    if (!code) throw { response: { status: 404 } };

    const args = getEventListArgs(API_EVENT_LIST_DEPARTMENT, { code });
    return apiClient.invokeApi(...args).then(res => res.data.events);
  }
};
