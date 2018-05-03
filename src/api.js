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

export function getAroundEventListArgs(position) {
  const params = {};
  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = '/events/around';
  const method = 'GET';
  const additionalParams = {
    queryParams: {
      lat: position.latitude,
      lng: position.longitude
    }
  };
  const body = {};

  return [params, pathTemplate, method, additionalParams, body];
}
