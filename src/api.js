import moment from 'moment';

export function getEventArgs(strideID) {
  const params = {
    strideID
  };
  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = '/stride/{strideID}';
  const method = 'GET';
  const additionalParams = {};
  const body = {};

  return [params, pathTemplate, method, additionalParams, body];
}

export function getAroundEventListArgs(geohash) {
  const params = {
    geohash
  };
  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = '/events/around/{geohash}';
  const method = 'GET';
  const additionalParams = {};
  const body = {};

  return [params, pathTemplate, method, additionalParams, body];
}
