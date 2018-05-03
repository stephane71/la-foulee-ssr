import moment from 'moment';

/*
 *  GET API methods args
 *  - getEventArgs
 *  - getEventListArgs
 */

const CURRENT_MONTH = moment().month();

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

export function getEventListArgs(selectors, currentPage = 0) {
  if (!selectors) {
    throw new Error('api: Selectors need to be specified');
  }

  let { month, dep } = selectors;
  let params = {
    month
  };

  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = '/strides/{month}';
  const method = 'GET';
  const additionalParams = {
    queryParams: {
      page: currentPage
    }
  };
  const body = {};

  return [params, pathTemplate, method, additionalParams, body];
}

export function getAroundEventListArgs(geohash, currentPage = 0) {
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
