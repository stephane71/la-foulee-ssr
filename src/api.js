const API_EVENT_LIST_AROUND = "around";
const API_EVENT_LIST_DEPARTMENT = "department";

function getEventListArgs(type, params) {
  let pathTemplate;
  if (type === API_EVENT_LIST_AROUND) pathTemplate = `/around/{geohash}`;
  if (type === API_EVENT_LIST_DEPARTMENT) pathTemplate = `/department/{code}`;
  const method = "GET";
  const additionalParams = {};
  const body = {};

  return [params, pathTemplate, method, additionalParams, body];
}

function postNewsletterEmailArgs(email) {
  const params = {};
  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = `/subscribe`;
  const method = "POST";
  const additionalParams = {};
  const body = { email };

  return [params, pathTemplate, method, additionalParams, body];
}

function postEventContributionArgs({ contribution, user, event }) {
  const { keyword, date } = event;

  const params = {};
  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = `/event`;
  const method = "POST";
  const additionalParams = {};
  const body = { contribution, user, keyword, date };

  return [params, pathTemplate, method, additionalParams, body];
}

module.exports = {
  API_EVENT_LIST_AROUND,
  API_EVENT_LIST_DEPARTMENT,
  getEventListArgs,
  postNewsletterEmailArgs,
  postEventContributionArgs
};
