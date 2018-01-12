module.exports = function(apigClient, strideID) {
  const params = {
    strideID
  };
  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = '/stride/{strideID}';
  const method = 'GET';
  const additionalParams = {};
  const body = {};

  return apigClient
    .invokeApi(params, pathTemplate, method, additionalParams, body)
    .then(res => res.data);
};
