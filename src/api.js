import { CURRENT_MONTH } from './enums';
/*
 *  GET API methods args
 *  - getEventArgs
 *  - getEventListArgs
 */

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

const defaultSelectors = {
  month: CURRENT_MONTH,
  dep: ''
};

export function getEventListArgs(
  selectors = defaultSelectors,
  currentPage = 0
) {
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
