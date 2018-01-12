module.exports = function(apigClient, selectors) {
  let { month, dep, page } = selectors;
  // page = page ? page : 0;
  let params = {
    month,
    page
  };

  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = '/strides/{month}';
  const method = 'GET';
  const additionalParams = {};
  const body = {};

  return apigClient
    .invokeApi(params, pathTemplate, method, additionalParams, body)
    .then(res => res.data);
};
