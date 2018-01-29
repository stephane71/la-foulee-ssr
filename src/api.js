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
  month: '0-2018',
  dep: '',
  page: 0
};

export function getEventListArgs(selectors = defaultSelectors) {
  let { month, dep, page } = selectors;
  // page = page ? page : 0;
  let params = {
    month,
    page
  };

  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = '/strides/{month}';
  const method = 'GET';
  const additionalParams = {
    queryParams: {
      page
    }
  };
  const body = {};

  return [params, pathTemplate, method, additionalParams, body];
}
