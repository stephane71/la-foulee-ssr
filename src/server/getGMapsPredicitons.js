const REQ_PREDICTIONS_OK = 'OK';

module.exports = function(city) {
  // WARNING: see https://arunoda.me/blog/ssr-and-server-only-modules
  const GoogleMaps = eval("require('@google/maps')");

  const googleMapsClient = GoogleMaps.createClient({
    key: process.env.SERVER_GOOGLE_PLACES_API_KEY,
    Promise: Promise
  });

  return googleMapsClient
    .placesAutoComplete({
      input: city,
      components: { country: 'fr' },
      types: '(cities)',
      language: 'fr',
      sessiontoken: ''
    })
    .asPromise()
    .then(
      data =>
        data.json.status === REQ_PREDICTIONS_OK ? data.json.predictions : []
    );
};
