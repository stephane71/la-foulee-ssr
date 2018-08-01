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

export function postNewsletterEmailArgs(email) {
  const params = {};
  // Template syntax follows url-template https://www.npmjs.com/package/url-template
  const pathTemplate = `/newsletter/subscribe`;
  const method = 'POST';
  const additionalParams = {};
  const body = { email };

  return [params, pathTemplate, method, additionalParams, body];
}
